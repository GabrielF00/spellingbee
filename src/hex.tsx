import React, {ChangeEvent, FormEvent} from 'react';
import './css/hexgrid.css';
import {GameWord, GameState, SubmitWordResponse, EndGameState} from "spellbee";
import SpellBeeService from "./data_service";
import {ChevronUpIcon, ChevronDownIcon, CheckIcon} from "@heroicons/react/solid";

const WORD_TOO_SHORT = "Words must be at least 4 letters."

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

interface FoundWordsButtonIconProps {
    foundWordsVisible: boolean
}

function FoundWordsButtonIcon(props: FoundWordsButtonIconProps) {
    if (props.foundWordsVisible) {
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
    newSingleGameOnClickHandler: any
}

function SplashScreen(props: SplashScreenProps) {
    const displayClass = props.splashScreenVisible ? "" : "hidden";
    return (
        <div className={"fixed z-40 pin overflow-auto bg-gray-600 flex top-0 bottom-0 left-0 w-full h-screen place-content-center place-items-center " + displayClass}>
            <div className="fixed shadow-inner max-w-md m-auto p-8 bg-white md:rounded w-full md:shadow flex flex-col">
                <h2 className="text-4xl text-center font-hairline md:leading-loose text-grey md:mt-8 mb-4">Bee Genius</h2>
                <button className="btn-gray" onClick={props.newSingleGameOnClickHandler}>
                    New Single Player Game
                </button>
                <button className="btn-gray">
                    Join Existing Game
                </button>
                <button className="btn-gray">
                    New Cooperative Game
                </button>
                <button className="btn-gray">
                    New Competitive Game
                </button>
            </div>
        </div>
    )
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
        console.log("i: " + i.word);
        console.log("found words set: " + Array.from(foundWordsSet).join(' '));
        console.log("in set: " + foundWordsSet.has(i.word));
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

interface HexGridProps {
}

interface HexGridState {
    gameId: number,
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
    state: HexGridState = {
        gameId: -1,
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

    async startGame() {
        let data: GameState = await SpellBeeService.createGame();
        this.setState({
            gameId: data.id,
            outerLetters: data.outer_letters,
            centerLetter: data.middle_letter,
            validLetters: this.createSetOfValidLetters(data.outer_letters, data.middle_letter),
            splashScreenVisible: false,
            endGameScreenVisible: false,
            foundWords: data.found_words,
            allWords: [],
            score: data.score,
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
            word: this.state.wordInProgress
        });
        switch(data.state) {
            case "success":
                this.setState({
                    wordInProgress: "",
                    errorMessage: `${data.response.is_pangram ? "Pangram! - " : ""} ${data.response.score} Point${pluralize(data.response.score)}!`,
                    foundWords: data.response.game_state.found_words,
                    score: data.response.game_state.score,
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
                        <div className="bg-gray-700 text-white font-bold py-2 px-4">
                            <p className="score_box text-center">{this.state.score}</p>
                        </div>
                        <div className="py-2 px-4">
                            <span className={"text-sm"}>{this.state.rank}</span>
                        </div>
                        <div className="py-2 flex-grow text-right text-gray-500">
                            <span className="text-sm align-middle">{this.getPointsToGeniusOrQueen()}</span>
                        </div>
                    </div>
                    <button className="w-full bg-gray-500 text-white mt-2 py-2 px-4" onClick={() => this.showHideFoundWords()}>
                        <div className="grid grid-cols-2">
                            <div className="col-start-1 place-self-start">
                                {`${this.state.foundWords.length} word${pluralize(this.state.foundWords.length)} found`}
                            </div>
                            <div className="col-start-2 place-self-end"><FoundWordsButtonIcon foundWordsVisible={this.state.foundWordsVisible}/></div>
                        </div>
                    </button>
                </div>
                <div className="relative max-w-md mt-2 mx-auto px-2">
                    <FoundWords foundWords={this.state.foundWords} foundWordsVisible={this.state.foundWordsVisible} />
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
                              newSingleGameOnClickHandler={() => this.startGame()}/>
                <EndGameScreen endGameScreenVisible={this.state.endGameScreenVisible} foundWords={this.state.foundWords}
                               score={this.state.score} maxScore={this.state.ranks["QUEEN"]} rank={this.state.rank}
                               allWords={this.state.allWords} closeButtonHandler={() => this.closeEndGameScreen()}/>
            </div>
        );
    }
}
