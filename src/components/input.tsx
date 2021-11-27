import React, {ChangeEvent, FormEvent} from "react";

interface InputProps {
    wordInProgress: string,
    fieldUpdater: any,
    formSubmitter: any,
    errorMessage: string
}

interface InputState {
}

export class Input extends React.Component<InputProps, InputState> {
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
                           onChange={this.handleChange} className="uppercase w-5/6 font-bold"/>
                    <input type="submit" className="btn-gold" value="Enter"/>
                </form>
                <div id="errorMessage" className="h-4">&nbsp;{this.props.errorMessage}</div>
            </div>
        );
    }
}