import React, {ChangeEvent, FormEvent} from 'react';
import './css/hexgrid.css';
import SpellBeeService from "./data_service";
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/solid";
import {
    EndGameState,
    GameState,
    GameType,
    GameWord,
    SubmitWordResponse,
    StartGameRequest
} from "spellbee";

const WORD_TOO_SHORT = "Words must be at least 4 letters."

export const SINGLE_PLAYER = 0;
export const COMPETITIVE = 1;
export const COOP = 2;

class ScoreBox extends React.Component<{ score: number }> {
    render() {
        return <div className="bg-gray-700 text-white font-bold py-2 px-4">
            <p className="score_box text-center">{this.props.score}</p>
        </div>;
    }
}

interface InputProps {
    wordInProgress: string,
    fieldUpdater: any,
    formSubmitter: any,
    errorMessage: string
}
interface InputState {}

class Input extends React.Component<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        this.props.fieldUpdater(event.target.value);
    }

    handleSubmit(event: FormEvent<HTMLFormElement>) {
        this.props.formSubmitter();
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form className="flex" onSubmit={this.handleSubmit}>
                    <input type="text" value={this.props.wordInProgress}
                           placeholder="Tap letters or type"
                           onChange={this.handleChange} className="uppercase w-5/6 font-bold" />
                    <input type="submit" className="btn-gold" value="GO!" />
                </form>
                <div id="errorMessage" className="h-4">&nbsp;{this.props.errorMessage}</div>
            </div>
        );
    }
}

interface HexTileProps {
    letter: String,
    tileOnClick: any
}

function HexTile(props: HexTileProps) {
    return (
        <li>
            <div className="hexagon" onClick={() => props.tileOnClick(props.letter)}>
                <p className="text-xl uppercase font-semibold">{props.letter}</p>
            </div>
        </li>
    )
}

interface ControlsProps {
    shuffleButtonOnClick: any
    deleteButtonOnClick: any
}

function Controls(props: ControlsProps) {
   return (
       <div className="grid w-4/6 mx-auto grid-cols-2 justify-items-center">
           <div><button className="btn-gray" onClick={props.shuffleButtonOnClick}>Shuffle</button></div>
           <div><button className="btn-gray" onClick={props.deleteButtonOnClick}>Delete</button></div>
       </div>
   )
}

interface ChevronButtonIconProps {
    contentVisible: boolean
}

function ChevronButtonIcon(props: ChevronButtonIconProps) {
    if (props.contentVisible) {
        return (
            <ChevronUpIcon className={"h-5 w-5"}/>
        )
    } else {
        return (
            <ChevronDownIcon className={"h-5 w-5"}/>
        )
    }
}

interface FoundWordsProps {
    foundWords: GameWord[],
    foundWordsVisible: boolean
}

function FoundWords(props: FoundWordsProps) {
    const displayClass = props.foundWordsVisible ? "block" : "hidden";
    const foundWordsDisp: Array<JSX.Element> = [];
    for (let i of props.foundWords.sort((a, b) => a.word.localeCompare(b.word))) {
        foundWordsDisp.push(
            <li key={i.word}>
                <p className={i.is_pangram ? "underline font-bold" : ""}>
                    {i.word}
                </p>
            </li>
        )
    }
    return (
        <div className={"absolute z-40 bg-white w-full h-full border-2 overscroll-auto overflow-auto " + displayClass}>
            <ul className="list-disc list-inside p-2 col-count-2">
                {foundWordsDisp}
            </ul>
        </div>
    )
}

interface SplashScreenProps {
    splashScreenVisible: boolean,
    newGameClickHandler: any,
    joinGameClickHandler: any
}

interface SplashScreenState {
    joinGameFormVisible: boolean,
    newCoopGameFormVisible: boolean,
    newCompetitiveGameFormVisible: boolean
}

class SplashScreen extends React.Component<SplashScreenProps, SplashScreenState> {

    constructor(props: SplashScreenProps) {
        super(props);
        this.handleNewCoopGameSubmit = this.handleNewCoopGameSubmit.bind(this);
    }

    state = {
        joinGameFormVisible: false,
        newCoopGameFormVisible: false,
        newCompetitiveGameFormVisible: false
    }

    handleJoinGameButtonPush() {
        this.setState({
            joinGameFormVisible: !this.state.joinGameFormVisible
        });
    }

    handleNewCoopGameButtonPush() {
        this.setState({
            newCoopGameFormVisible: !this.state.newCoopGameFormVisible
        });
    }

    handleNewCompetitiveGameButtonPush() {
        this.setState({
            newCompetitiveGameFormVisible: !this.state.newCompetitiveGameFormVisible
        });
    }

    handleNewCoopGameSubmit(playerName: string) {
        this.props.newGameClickHandler(COOP, playerName);
    }

    render() {
        const displayClass = this.props.splashScreenVisible ? "" : "hidden";
        return (
            <div
                className={"fixed z-40 pin overflow-auto bg-gray-600 flex top-0 bottom-0 left-0 w-full h-screen place-content-center place-items-center " + displayClass}>
                <div
                    className="fixed shadow-inner max-w-md m-auto p-8 bg-white md:rounded w-full md:shadow flex flex-col">
                    <h2 className="text-4xl text-center font-hairline md:leading-loose text-grey md:mt-8 mb-4">Bee
                        Genius</h2>
                    <button className="btn-gray" onClick={() => this.props.newGameClickHandler(0, "")}>
                        New Single Player Game
                    </button>
                    <hr/>
                    <ExpandingButton onClick={() => this.handleJoinGameButtonPush()} contentVisible={this.state.joinGameFormVisible}
                                     buttonText={"Join Existing Game"}/>
                    <HiddenForm placeHolderText={"Game code"} handleSubmit={() => {}} isVisible={this.state.joinGameFormVisible}/>
                    <ExpandingButton onClick={() => this.handleNewCoopGameButtonPush()} contentVisible={this.state.newCoopGameFormVisible}
                                     buttonText={"New Cooperative Game"}/>
                    <HiddenForm placeHolderText={"Player name"} handleSubmit={this.handleNewCoopGameSubmit} isVisible={this.state.newCoopGameFormVisible}/>
                    <ExpandingButton onClick={() => this.handleNewCompetitiveGameButtonPush()} contentVisible={this.state.newCompetitiveGameFormVisible}
                                     buttonText={"New Competitive Game"}/>
                    <HiddenForm placeHolderText={"Player name"} handleSubmit={this.props.newGameClickHandler} isVisible={this.state.newCompetitiveGameFormVisible}/>
                </div>
            </div>
        )
    }
}

interface EndGameScreenProps {
    endGameScreenVisible: boolean,
    foundWords: GameWord[],
    allWords: GameWord[],
    score: number,
    maxScore: number,
    rank: string,
    closeButtonHandler: any
}

function EndGameScreen(props: EndGameScreenProps) {
    const displayClass = props.endGameScreenVisible ? "" : "hidden";
    const foundWordsSet = new Set(props.foundWords.map(word => word.word));
    const wordsDisp: Array<JSX.Element> = [];

    for (let i of props.allWords.sort((a, b) => a.word.localeCompare(b.word))) {
        wordsDisp.push(
            <li key={i.word}>
                <span className={i.is_pangram ? "underline font-bold" : ""}>
                    {i.word}
                </span>
                {foundWordsSet.has(i.word) && <CheckIcon className={"h-5 w-5 text-yellow-500 inline"} />}
            </li>
        )
    }

    return (
        <div className={"absolute z-40 top-0 bg-white w-full h-full overscroll-auto overflow-auto " + displayClass}>
            <div className="w-full h-full space-y-2 flex flex-col">
                <h2 className="text-4xl text-center font-hairline md:leading-loose text-grey my-4">Game Over</h2>
                <p className="text-2xl text-center">Score: {props.score + " / " + props.maxScore}</p>
                <p className="text-2xl text-center">{props.rank}</p>
                <div className={"flex-1 overflow-auto overscroll-auto my-2"}>
                    <ul className="list-disc list-inside p-2 col-count-2">
                        {wordsDisp}
                    </ul>
                </div>
                <div className="mx-auto my-2">
                <button className="btn-gray" onClick={props.closeButtonHandler}>
                    New Game
                </button>
                </div>
            </div>
        </div>
    )
}

class ExpandingButton extends React.Component<{ onClick: () => void, contentVisible: boolean, buttonText: string }> {
    render() {
        return <button className="w-full bg-gray-500 text-white mt-2 py-2 px-4"
                       onClick={this.props.onClick}>
            <div className="grid grid-cols-6">
                <div className="col-start-1 col-span-5 place-self-start">
                    {this.props.buttonText}
                </div>
                <div className="col-start-6 place-self-end"><ChevronButtonIcon
                    contentVisible={this.props.contentVisible}/></div>
            </div>
        </button>;
    }
}

interface HiddenFormProps {
    placeHolderText: string,
    handleSubmit: any,
    isVisible: boolean
}

interface HiddenFormState {
    value: string
}

class HiddenForm extends React.Component<HiddenFormProps, HiddenFormState> {
    constructor(props: HiddenFormProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    state = {
        value: ''
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({value: event.target.value});
    }

    submit(event: FormEvent<HTMLFormElement>) {
        this.props.handleSubmit(this.state.value);
        event.preventDefault();
    }

    render() {
        const displayClass = this.props.isVisible ? "block" : "hidden";
        return <div className={displayClass}>
            <form className="flex" onSubmit={this.submit}>
                <input type="text"
                       value={this.state.value}
                       placeholder={this.props.placeHolderText}
                       onChange={this.handleChange}
                       className="uppercase w-5/6 font-bold pl-2 ml-2" />
                <input type="submit" className="btn-gold" value="GO!" />
            </form>
        </div>
    }
}

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
    foundWords: GameWord[],
    allWords: GameWord[],
    foundWordsVisible: boolean,
    endGameScreenVisible: boolean,
    score: number,
    rank: string,
    splashScreenVisible: boolean,
    ranks: Record<string, number>
}

function pluralize(pointsLeft: number) {
    return pointsLeft === 1 ? "" : "s";
}

export class HexGrid extends React.Component<HexGridProps, HexGridState> {

    constructor(props: HexTileProps) {
        super(props);
        this.startGame = this.startGame.bind(this);
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
        score: 0,
        rank: "EGG",
        splashScreenVisible: true,
        ranks: {}
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
            score: data.scores[playerName],
            rank: data.current_rank,
            ranks: data.ranks
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
                    errorMessage: `${data.response.is_pangram ? "Pangram! - " : ""} ${data.response.score} Point${pluralize(data.response.score)}!`,
                    foundWords: data.response.game_state.found_words,
                    score: data.response.game_state.scores[this.state.playerName],
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
        console.log(endGameState);
        this.setState({
            endGameScreenVisible: true,
            allWords: endGameState.response.all_words
        });
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
        if (this.state.score >= geniusScore) {
            pointsLeft = queenScore - this.state.score;
            nextRank = "queen";
        }
        else {
            pointsLeft = geniusScore - this.state.score;
            nextRank = "genius";
        }
        return `${pointsLeft} point${pluralize(pointsLeft)} to ${nextRank}`
    }

    closeEndGameScreen() {
        this.setState({
            endGameScreenVisible: false,
            splashScreenVisible: true
        });
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

        return (
            <div className="relative max-w-md mt-2 mx-auto">
                <div className="max-w-md mt-2 mx-auto px-2">
                    <div className="flex w-full">
                        <ScoreBox score={this.state.score}/>
                        <div className="py-2 px-4">
                            <span className={"text-sm"}>{this.state.rank}</span>
                        </div>
                        <div className="py-2 flex-grow text-right text-gray-500">
                            <span className="text-sm align-middle">{this.getPointsToGeniusOrQueen()}</span>
                        </div>
                    </div>
                    <ExpandingButton onClick={() => this.showHideFoundWords()} contentVisible={this.state.foundWordsVisible}
                                     buttonText={`${this.state.foundWords.length} word${pluralize(this.state.foundWords.length)} found`}/>
                </div>
                <div className="relative max-w-md mt-2 mx-auto px-2">
                    <FoundWords foundWords={this.state.foundWords} foundWordsVisible={this.state.foundWordsVisible}/>
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
                    <div className="mx-auto flex justify-content-center">
                        <button className="btn-gray flex-1" onClick={() => this.endGame()}>
                            End game and show answers
                        </button>
                    </div>
                </div>
                <SplashScreen splashScreenVisible={this.state.splashScreenVisible}
                              newGameClickHandler={this.startGame} joinGameClickHandler={() => {}}/>
                <EndGameScreen endGameScreenVisible={this.state.endGameScreenVisible} foundWords={this.state.foundWords}
                               score={this.state.score} maxScore={this.state.ranks["QUEEN"]} rank={this.state.rank}
                               allWords={this.state.allWords} closeButtonHandler={() => this.closeEndGameScreen()}/>
            </div>
        );
    }
}
