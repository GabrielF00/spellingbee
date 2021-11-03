import React, {ReactNodeArray} from "react";

class Button extends React.Component<{ onClick: () => void, buttonText: string, buttonClass: string }> {
    render() {
        return <button className={this.props.buttonClass} onClick={this.props.onClick}>{this.props.buttonText}</button>;
    }
}

export class CloseButton extends React.Component<{ onClick: () => void }> {
    render() {
        return <Button onClick={this.props.onClick} buttonText={"Close"} buttonClass={"btn-gray"}/>;
    }
}

export class CancelButton extends React.Component<{ onClick: () => void }> {
    render() {
        return <Button onClick={this.props.onClick} buttonText={"Cancel"} buttonClass={"btn-gray"}/>;
    }
}

export function Modal(props: { title: string, content: string, buttons: ReactNodeArray }) {
    return (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"/>

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">{props.title}</p>
                    </div>
                    {props.content}
                    <div className="flex justify-end pt-2">
                        {props.buttons}
                    </div>
                </div>
            </div>
        </div>
    )
}