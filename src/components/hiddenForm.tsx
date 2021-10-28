import React, {ChangeEvent, FormEvent} from "react";

export interface HiddenFormProps {
    placeHolderText: string,
    handleSubmit: any,
    isVisible: boolean
}

interface HiddenFormState {
    value: string
}

export class HiddenForm extends React.Component<HiddenFormProps, HiddenFormState> {
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
                       className="uppercase w-5/6 font-bold pl-2 ml-2"/>
                <input type="submit" className="btn-gold" value="GO!"/>
            </form>
        </div>
    }
}