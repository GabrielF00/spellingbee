import React from 'react';
import './index.css';

export interface SquareProps {
    value: String;
    onClick: any
}

export function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export interface BoardProps {
    squares: Squares,
    onClick: any
}

export interface BoardState {}

export class Board extends React.Component<BoardProps, BoardState> {

    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
type Squares = Array<string>;

export interface GameProps {}
export interface GameState {
    history: Array<Squares>,
    xIsNext: boolean,
    stepNumber: number
}

export class Game extends React.Component<GameProps, GameState> {
    state: GameState = {
        history: [new Array<string>(9).fill("")],
        xIsNext: true,
        stepNumber: 0
    }

    handleClick(i: number) {
        const history: Array<Squares> = this.state.history.slice(0, this.state.stepNumber + 1);
        const current: Squares = history[history.length - 1];
        const squares: Squares = current.slice()
        if (calculateWinner(squares) || squares[i] !== '') {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([squares]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history: Array<Squares> = this.state.history
        const current: Squares = history[this.state.stepNumber]
        const winner: string = calculateWinner(current)

        const moves = history.map((step, move) => {
            const desc: string = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick = {() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status: string;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current}
                        onClick={(i: number) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares: Array<string>): string {
    const lines: Array<Array<number>> = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i: number = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return "";
}
