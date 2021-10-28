import React, {ChangeEvent, FormEvent} from "react";
import {HiddenFormProps} from "./hiddenForm";

interface JoinGameFormProps extends HiddenFormProps {
    gameCode: string
}

interface JoinGameFormState {
    gameCode: string,
    playerName: string
}

export class JoinGameForm extends React.Component<JoinGameFormProps, JoinGameFormState> {
    constructor(props: JoinGameFormProps) {
        super(props);
        this.handleGameCodeChange = this.handleGameCodeChange.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    state = {
        gameCode: this.props.gameCode,
        playerName: ''
    }

    handleGameCodeChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({gameCode: event.target.value});
    }

    handlePlayerNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({playerName: event.target.value});
    }

    submit(event: FormEvent<HTMLFormElement>) {
        this.props.handleSubmit(this.state.playerName, this.state.gameCode);
        event.preventDefault();
    }

    render() {
        const displayClass = this.props.isVisible ? "block" : "hidden";
        return <div className={displayClass}>
            <form className="" onSubmit={this.submit}>
                <input type="text"
                       value={this.state.gameCode}
                       placeholder={"Game Code"}
                       onChange={this.handleGameCodeChange}
                       className="uppercase font-bold w-full m-2 pl-2 py-2.5 my-2 clear-both block"/>
                <div className="flex">
                    <input type="text"
                           value={this.state.playerName}
                           placeholder={this.props.placeHolderText}
                           onChange={this.handlePlayerNameChange}
                           className="uppercase w-5/6 font-bold pl-2 ml-2"/>
                    <input type="submit" className="btn-gold" value="GO!"/>
                </div>
            </form>
        </div>
    }
}