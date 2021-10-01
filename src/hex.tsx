import React, {ChangeEvent, FormEvent} from 'react';
import './css/hexgrid.css';
import {GameState, SubmitWordResponse} from "spellbee";
import SpellBeeService from "./data_service";
import {ChevronUpIcon, ChevronDownIcon} from "@heroicons/react/solid";

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
    foundWords: string[],
    foundWordsVisible: boolean
}

function FoundWords(props: FoundWordsProps) {
    const displayClass = props.foundWordsVisible ? "block" : "hidden";
    const foundWordsDisp: Array<JSX.Element> = [];
    for (let i in props.foundWords.sort()) {
        foundWordsDisp.push(<li key={props.foundWords[i]}>{props.foundWords[i]}</li>)
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
        <div className={"fixed z-50 pin overflow-auto bg-gray-600 flex top-0 bottom-0 w-full h-screen place-content-center place-items-center " + displayClass}>
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

interface HexGridProps {
}

interface HexGridState {
    gameId: number,
    outerLetters: string,
    centerLetter: string,
    wordInProgress: string,
    validLetters: Set<string>,
    errorMessage: string,
    foundWords: string[],
    foundWordsVisible: boolean,
    score: number,
    rank: string,
    splashScreenVisible: boolean,
    ranks: Record<string, number>
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
        foundWordsVisible: false,
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
            foundWords: data.found_words,
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
                    errorMessage: "" + data.response.score + " Points!",
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
        return `${pointsLeft} point${pointsLeft === 1 ? "" : "s"} to ${nextRank}`
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
            <div>
                <div className="max-w-md mt-2 mx-auto px-2">
                    <div className="flex w-full">
                        <div className="bg-gray-700 text-white font-bold py-2 px-4">
                            <p className="score_box text-center">{this.state.score}</p>
                        </div>
                        <div className="py-2 px-4">
                            <p>{this.state.rank}</p>
                        </div>
                        <div className="py-2 px-4 flex-grow text-right text-gray-500">
                            <p>{this.getPointsToGeniusOrQueen()}</p>
                        </div>
                    </div>
                    <button className="w-full bg-gray-500 text-white mt-2 py-2 px-4" onClick={() => this.showHideFoundWords()}>
                        <div className="grid grid-cols-2">
                            <div className="col-start-1 place-self-start">{`${this.state.foundWords.length} words found`}</div>
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
                </div>
                <SplashScreen splashScreenVisible={this.state.splashScreenVisible}
                              newSingleGameOnClickHandler={() => this.startGame()}/>
            </div>
        );
    }
}
