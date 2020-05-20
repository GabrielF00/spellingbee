import React, {ChangeEvent, FormEvent} from 'react';
import './hexgrid.css';

interface InputProps {
    wordInProgress: string,
    fieldUpdater: any
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
        alert('A name was submitted: ' + this.props.wordInProgress);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.props.wordInProgress}
                       onChange={this.handleChange} />
                <input type="submit" value="Submit" />
            </form>
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

interface HexGridProps {}
interface HexGridState {
    letters: string,
    centerLetter: string,
    wordInProgress: string
}

export class HexGrid extends React.Component<HexGridProps, HexGridState> {
    state: HexGridState = {
        letters: "BCDEFG",
        centerLetter: "A",
        wordInProgress: ""
    }

    handleTileClick(letter: string) {
        this.setState({
            wordInProgress: this.state.wordInProgress + letter
        })
    }

    handleUpdateToInputField(newText: string) {
        this.setState({
            wordInProgress: newText.toUpperCase()
        })
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
        let tiles: Array<JSX.Element> = [];
        for (let i: number = 0; i < 3 ; i++) {
            tiles.push(<HexTile letter={this.state.letters.charAt(i)} listKey={i}
                                tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        }
        tiles.push(<HexTile letter={this.state.centerLetter} listKey={3}
                            tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        for (let i: number = 3; i <  6; i++) {
            tiles.push(<HexTile letter={this.state.letters.charAt(i)} listKey={i+1}
                                tileOnClick={(letter: string) => this.handleTileClick(letter)}/>);
        }
        return (
            <div>
                <Input wordInProgress={this.state.wordInProgress}
                       fieldUpdater={(newText: string) => this.handleUpdateToInputField(newText)}/>
                <ul id="grid" className="clear">
                    {tiles}
                </ul>
                <Controls shuffleButtonOnClick={() => this.shuffle()}
                          deleteButtonOnClick={() => this.delete()}/>
            </div>
        );
    }
}
