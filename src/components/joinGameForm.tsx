import React, {ChangeEvent, FormEvent} from "react";
import {HiddenFormProps} from "./hiddenForm";
import {ErrorAlert} from "./errorAlert";

interface JoinGameFormProps extends HiddenFormProps {
    gameCode: string
}

interface JoinGameFormState {
    gameCode: string,
    playerName: string,
    errorMessage: string
}

export class JoinGameForm extends React.Component<JoinGameFormProps, JoinGameFormState> {
    constructor(props: JoinGameFormProps) {
        super(props);
        this.handleGameCodeChange = this.handleGameCodeChange.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.submit = this.submit.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
    }

    state = {
        gameCode: this.props.gameCode,
        playerName: '',
        errorMessage: ''
    }

    handleGameCodeChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({gameCode: event.target.value});
    }

    handlePlayerNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({playerName: event.target.value});
    }

    submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.state.playerName === '') {
            this.errorCallback("Please enter a name.")
            return;
        }
        this.props.handleSubmit(this.state.playerName, this.state.gameCode, this.errorCallback);
        this.errorCallback('');
    }

    errorCallback(errorMessage: string) {
        this.setState({
            errorMessage: errorMessage
        });
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
                <ErrorAlert errorMessage={this.state.errorMessage}/>
            </form>
        </div>
    }
}