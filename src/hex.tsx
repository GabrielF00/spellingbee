import React, {ChangeEvent, FormEvent} from 'react';
import './hexgrid.css';

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
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.props.wordInProgress}
                           onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                <div id="errorMessage">{this.props.errorMessage}</div>
            </div>
        );
    }
}

interface HexTileProps {
    letter: String,
    listKey: number,
    tileOnClick: any
}

function HexTile(props: HexTileProps) {
    return (
        <li key={props.listKey.toString() + "key"}>
            <div className="hexagon" onClick={() => props.tileOnClick(props.letter)}>
                <h1 className="letter">{props.letter}</h1>
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
       <div>
           <button onClick={props.shuffleButtonOnClick}>Shuffle</button>
           <button onClick={props.deleteButtonOnClick}>Delete</button>
       </div>
   )
}

interface HexGridProps {
    letters: string,
    centerLetter: string
}
interface HexGridState {
    letters: string,
    wordInProgress: string,
    validLetters: Set<string>,
    errorMessage: string
}

export class HexGrid extends React.Component<HexGridProps, HexGridState> {
    state: HexGridState = {
        letters: this.props.letters,
        validLetters: this.createSetOfValidLetters(this.props.letters),
        wordInProgress: "",
        errorMessage: ""
    }

    createSetOfValidLetters(letters: string) {
        const validLetters:Set<string> = new Set();
        letters.split('').map(l => validLetters.add(l));
        validLetters.add(this.props.centerLetter)
        return validLetters;
    }

    handleTileClick(letter: string) {
        this.handleUpdateToInputField(this.state.wordInProgress + letter)
    }

    handleUpdateToInputField(newText: string) {
        const toAdd: string = newText.toUpperCase()
            .split('')
            .filter(l => this.state.validLetters.has(l))
            .join('');
        this.setState({
            wordInProgress: toAdd,
            errorMessage: ""
        })
    }

    handleEnterButton() {
        if (this.state.wordInProgress.length < 4) {
            this.setState({
                errorMessage: WORD_TOO_SHORT
            });
            return;
        }
        alert(this.state.wordInProgress);
    }

    delete() {
        this.setState({
            wordInProgress: this.state.wordInProgress.substring(0, this.state.wordInProgress.length - 1)
        })
    }

    shuffle() {
        const shuffled = this.state.letters
            .split('')
            .sort(function(){return 0.5 - Math.random()})
            .join('');
        this.setState({letters: shuffled});
    }

    render() {
        const tiles: Array<JSX.Element> = [];
        for (let i: number = 0; i < 3 ; i++) {
            tiles.push(<HexTile letter={this.state.letters.charAt(i)} listKey={i}
                                tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        }
        tiles.push(<HexTile letter={this.props.centerLetter} listKey={3}
                            tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        for (let i: number = 3; i <  6; i++) {
            tiles.push(<HexTile letter={this.state.letters.charAt(i)} listKey={i+1}
                                tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        }
        return (
            <div>
                <Input wordInProgress={this.state.wordInProgress}
                       fieldUpdater={(newText: string) => this.handleUpdateToInputField(newText)}
                       formSubmitter={() => this.handleEnterButton()}
                       errorMessage={this.state.errorMessage}/>
                <ul id="grid" className="clear">
                    {tiles}
                </ul>
                <Controls shuffleButtonOnClick={() => this.shuffle()}
                          deleteButtonOnClick={() => this.delete()}/>
            </div>
        );
    }
}
