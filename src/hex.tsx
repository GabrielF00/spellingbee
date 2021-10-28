import React from 'react';
import './css/hexgrid.css';
import SpellBeeService from "./data_service";
import {
    EndGameState,
    GameState,
    GameType,
    GameUpdate,
    GameWord,
    JoinGameRequest,
    JoinGameResponse,
    MPGameWord,
    StartGameRequest,
    SubmitWordResponse
} from "spellbee";
import {Route, Switch} from "react-router-dom";
import {ScoreBox} from "./components/scoreBox";
import {Input} from "./components/input";
import {HexTile, HexTileProps} from "./components/hexTile";
import {Controls} from "./components/controls";
import {ExpandingButton} from "./components/expandingButton";
import {EndGameScreen} from "./components/endGameScreen";
import {SplashScreen} from "./components/splashScreen";
import {FoundWordsList} from "./components/foundWordsList";

const WORD_TOO_SHORT = "Words must be at least 4 letters."

export const SINGLE_PLAYER = 0;
export const COMPETITIVE = 1;
export const COOP = 2;

interface HexGridProps {
}

interface HexGridState {
    gameId: number,
    gameType: number,
    playerName: string
    outerLetters: string,
    centerLetter: string,
    wordInProgress: string,
    validLetters: Set<string>,
    errorMessage: string,
    foundWords: MPGameWord[],
    allWords: GameWord[],
    foundWordsVisible: boolean,
    endGameScreenVisible: boolean,
    playerScore: number,
    teamScore: number,
    rank: string,
    splashScreenVisible: boolean,
    ranks: Record<string, number>,
    scores: Record<string, number>,
    gameCode: string,
    eventSource?: EventSource
}

export class HexGrid extends React.Component<HexGridProps, HexGridState> {

    constructor(props: HexTileProps) {
        super(props);
        this.startGame = this.startGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
    }

    state: HexGridState = {
        gameId: -1,
        gameType: -1,
        playerName: "",
        outerLetters: "",
        centerLetter: "",
        validLetters: new Set<string>(),
        wordInProgress: "",
        errorMessage: "",
        foundWords: [],
        allWords: [],
        foundWordsVisible: false,
        endGameScreenVisible: false,
        playerScore: 0,
        teamScore: 0,
        rank: "EGG",
        splashScreenVisible: true,
        ranks: {},
        scores: {},
        gameCode: "",
    }

    async startGame(gameType: GameType, playerName: string) {

        let request: StartGameRequest;
        switch (gameType) {
            case SINGLE_PLAYER:
                request = {game_type: SINGLE_PLAYER}
                break;
            case COMPETITIVE:
            case COOP:
                request = {game_type: gameType, player_name: playerName}
                break;
        }

        let data: GameState = await SpellBeeService.createGame(request);
        this.setStateFromServer(data, playerName);
        if (gameType !== SINGLE_PLAYER) {
            this.subscribeToUpdates(playerName, data.game_code);
        }
    }

    async joinGame(playerName: string, gameCode: string) {
        let request: JoinGameRequest = {player_name: playerName, game_id: gameCode};
        let response: JoinGameResponse = await SpellBeeService.joinGame(request);
        switch(response.state) {
            case "success":
                this.setStateFromServer(response.response.game_state, playerName);
                break;
            case "failed":
                console.log(response.error_message);
                break;
        }
        this.subscribeToUpdates(playerName, gameCode);
    }

    subscribeToUpdates(playerName: string, gameCode: string) {
        const url = `${process.env.REACT_APP_BACKEND_HOST}/subscribeToUpdates/game/${gameCode}/player/${playerName}`;
        const events = new EventSource(url);
        this.setState({eventSource: events});
        events.onopen = (event) => {
            console.log("Opening connection");
            console.log(event);
        }
        events.onmessage = (event) => {
            console.log("on message");
            console.log(event);
            if (event.data == null || event.data === "") {
                return;
            }
            const data: GameUpdate = JSON.parse(event.data);
            console.log(data);
            const newScores = this.state.scores;
            newScores[data.found_word.player] = data.finder_score;
            this.setState(prevState => ({
                teamScore: data.team_score,
                foundWords: [...prevState.foundWords, data.found_word],
                rank: data.current_rank,
                scores: newScores,
                errorMessage: `${data.found_word.player} found ${data.found_word.word}`
            }));
        }
        events.onerror = (event) => {
            console.log("on error");
            console.log(event);
        }
    }

    private setStateFromServer(data: GameState, playerName: string) {
        this.setState({
            gameId: data.id,
            outerLetters: data.outer_letters,
            centerLetter: data.middle_letter,
            playerName: playerName,
            validLetters: this.createSetOfValidLetters(data.outer_letters, data.middle_letter),
            splashScreenVisible: false,
            endGameScreenVisible: false,
            foundWords: data.found_words,
            allWords: [],
            teamScore: data.team_score,
            playerScore: data.scores[playerName],
            rank: data.current_rank,
            ranks: data.ranks,
            gameType: data.game_type,
            scores: data.scores,
            gameCode: data.game_code,
            errorMessage: ""
        });
    }

    createSetOfValidLetters(outerLetters: string, centerLetter: string) {
        const validLetters:Set<string> = new Set();
        outerLetters.split('').map(l => validLetters.add(l));
        validLetters.add(centerLetter);
        return validLetters;
    }

    handleTileClick(letter: string) {
        this.handleUpdateToInputField(this.state.wordInProgress + letter)
    }

    handleUpdateToInputField(newText: string) {
        const toAdd: string = newText
            .split('')
            .filter(l => this.state.validLetters.has(l))
            .join('');
        this.setState({
            wordInProgress: toAdd,
            errorMessage: ""
        })
    }

    async handleEnterButton() {
        if (this.state.wordInProgress.length < 4) {
            this.setState({
                errorMessage: WORD_TOO_SHORT
            });
            return;
        }
        let data: SubmitWordResponse = await SpellBeeService.submitWord({
            gameId: this.state.gameId,
            player_name: this.state.playerName,
            word: this.state.wordInProgress
        });
        switch(data.state) {
            case "success":
                this.setState({
                    wordInProgress: "",
                    errorMessage: `${data.response.is_pangram ? "Pangram! - " : ""} ${data.response.word_score} Point${this.pluralize(data.response.word_score)}!`,
                    foundWords: data.response.game_state.found_words,
                    playerScore: data.response.game_state.scores[this.state.playerName],
                    teamScore: data.response.game_state.team_score,
                    scores: data.response.game_state.scores,
                    rank: data.response.game_state.current_rank
                });
                break;
            case "failed":
                this.setState({
                    wordInProgress: "",
                    errorMessage: data.error_message
                });
                break;
        }
    }

    async endGame() {
        let endGameState: EndGameState = await SpellBeeService.endGame({
            gameId: this.state.gameId
        });
        this.setState({
            endGameScreenVisible: true,
            allWords: endGameState.response.all_words,
            scores: endGameState.response.game_state.scores
        });
        if (this.state.eventSource != null) {
            this.state.eventSource.close();
        }
    }

    delete() {
        this.setState({
            wordInProgress: this.state.wordInProgress.substring(0, this.state.wordInProgress.length - 1)
        })
    }

    shuffle() {
        const shuffled = this.state.outerLetters
            .split('')
            .sort(function(){return 0.5 - Math.random()})
            .join('');
        this.setState({outerLetters: shuffled});
    }

    showHideFoundWords() {
        this.setState({
            foundWordsVisible: !this.state.foundWordsVisible
        });
    }

    getPointsToGeniusOrQueen() {
        const geniusScore = this.state.ranks["GENIUS"];
        const queenScore = this.state.ranks["QUEEN"];

        let pointsLeft: number;
        let nextRank: string;
        if (this.state.teamScore >= geniusScore) {
            pointsLeft = queenScore - this.state.teamScore;
            nextRank = "queen";
        }
        else {
            pointsLeft = geniusScore - this.state.teamScore;
            nextRank = "genius";
        }
        return `${pointsLeft} point${this.pluralize(pointsLeft)} to ${nextRank}`
    }

    closeEndGameScreen() {
        this.setState({
            endGameScreenVisible: false,
            splashScreenVisible: true
        });
    }

    share() {
        const shareUrl = process.env.PUBLIC_URL + "/game/" + this.state.gameCode;
        if (navigator.share) {
            navigator.share({
                title: 'Join my game of Bee Genius',
                text: 'Join my game of Bee Genius',
                url: shareUrl
            })
        }
    }

    pluralize(value: number) {
        return value === 1 ? "" : "s";
    }

    render() {
        const tiles: Array<JSX.Element> = [];
        for (let i: number = 0; i < 3 ; i++) {
            tiles.push(<HexTile key={i} letter={this.state.outerLetters.charAt(i)}
                                tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        }
        tiles.push(<HexTile key={3} letter={this.state.centerLetter}
                            tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        for (let i: number = 3; i <  6; i++) {
            tiles.push(<HexTile key={i+1} letter={this.state.outerLetters.charAt(i)}
                                tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        }

        const teamScoreBox = this.state.gameType === SINGLE_PLAYER
            ? <div className="py-2 px-4"><span className={"text-sm"}>{this.state.rank}</span></div>
            : <div className="px-2"><ScoreBox score={this.state.teamScore} caption={"Team"} hide_caption={false}/></div>

        const bottomButtons = this.state.gameType === SINGLE_PLAYER
            ? <div className="mx-auto flex justify-content-center">
                <button className="btn-gray flex-1" onClick={() => this.endGame()}>
                    End game and show answers
                </button>
                </div>
            : <div className="grid grid-cols-2">
                <button className="btn-gray flex-1" onClick={() => this.share()}>
                    Share
                </button>
                <button className="btn-gray flex-1" onClick={() => this.endGame()}>
                    Leave game
                </button>
            </div>;

        return (
            <div className="relative max-w-md mt-2 mx-auto">
                <div className="max-w-md mt-2 mx-auto px-2">
                    <div className="flex w-full">
                        <ScoreBox score={this.state.playerScore} caption={"You"} hide_caption={this.state.gameType === SINGLE_PLAYER}/>
                        {teamScoreBox}
                        <div className="py-2 flex-grow text-right text-gray-500">
                            <span className="text-sm align-baseline inline">{this.getPointsToGeniusOrQueen()}</span>
                        </div>
                    </div>
                    <ExpandingButton onClick={() => this.showHideFoundWords()} contentVisible={this.state.foundWordsVisible}
                                     buttonText={`${this.state.foundWords.length} word${this.pluralize(this.state.foundWords.length)} found`}/>
                </div>
                <div className="relative max-w-md mt-2 mx-auto px-2">
                    <FoundWordsList foundWords={this.state.foundWords} foundWordsVisible={this.state.foundWordsVisible} scores={this.state.scores} isMultiplayer={this.state.gameType !== SINGLE_PLAYER}/>
                    <Input wordInProgress={this.state.wordInProgress}
                           fieldUpdater={(newText: string) => this.handleUpdateToInputField(newText)}
                           formSubmitter={() => this.handleEnterButton()}
                           errorMessage={this.state.errorMessage}
                    />
                    <div className="mt-4 mb-2">
                        <ul id="grid" className="clear">
                            {tiles}
                        </ul>
                    </div>
                    <Controls shuffleButtonOnClick={() => this.shuffle()}
                              deleteButtonOnClick={() => this.delete()}/>
                    {bottomButtons}
                </div>
                <Switch>
                    <Route path="/game/:gameCode" render={(routeProps) => {
                            return <SplashScreen gameSpecifiedInUrl={true} splashScreenVisible={this.state.splashScreenVisible}
                                      newGameClickHandler={this.startGame} joinGameClickHandler={this.joinGame} gameCode={routeProps.match.params.gameCode}/>}
                        }
                    />
                    <Route path="/">
                        <SplashScreen gameSpecifiedInUrl={false}
                                      splashScreenVisible={this.state.splashScreenVisible}
                                      newGameClickHandler={this.startGame} joinGameClickHandler={this.joinGame} gameCode=""/>
                    </Route>
                </Switch>
                <EndGameScreen endGameScreenVisible={this.state.endGameScreenVisible} foundWords={this.state.foundWords}
                               score={this.state.teamScore} maxScore={this.state.ranks["QUEEN"]} rank={this.state.rank}
                               allWords={this.state.allWords} closeButtonHandler={() => this.closeEndGameScreen()}/>
            </div>
        );
    }
}
