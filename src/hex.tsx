import React, {ChangeEvent, FormEvent} from 'react';
import './hexgrid.css';

interface InputProps {}
interface InputState {
    toSubmit: string
}

class Input extends React.Component<InputProps, InputState> {
    constructor(props: InputProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    state: InputState = {
        toSubmit: ''
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({toSubmit: event.target.value});
    }

    handleSubmit(event: FormEvent<HTMLFormElement>) {
        alert('A name was submitted: ' + this.state.toSubmit);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.toSubmit} onChange={this.handleChange} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

interface HexTileProps {
    letter: String,
    listKey: number
}

function HexTile(props: HexTileProps) {
    return (
        <li key={props.listKey.toString() + "key"}>
            <div className="hexagon">
                <h1 className="letter">{props.letter}</h1>
            </div>
        </li>
    )
}

interface ControlsProps {
    shuffleButtonOnClick: any
}

function Controls(props: ControlsProps) {
   return (
       <button onClick={() => props.shuffleButtonOnClick()}>Shuffle</button>
   )
}

interface HexGridProps {}
interface HexGridState {
    letters: string,
    centerLetter: string
}

export class HexGrid extends React.Component<HexGridProps, HexGridState> {
    state: HexGridState = {
        letters: "BCDEFG",
        centerLetter: "A"
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
            tiles.push(<HexTile letter={this.state.letters.charAt(i)} listKey={i}/>);
        }
        tiles.push(<HexTile letter={this.state.centerLetter} listKey={3}/>);
        for (let i: number = 3; i <  6; i++) {
            tiles.push(<HexTile letter={this.state.letters.charAt(i)} listKey={i+1}/>);
        }
        return (
            <div>
                <Input />
                <ul id="grid" className="clear">
                    {tiles}
                </ul>
                <Controls shuffleButtonOnClick={() => this.shuffle()}/>
            </div>
        );
    }
}
