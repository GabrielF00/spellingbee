import React from "react";
import {ChevronButtonIcon} from "./chevronButtonIcon";

export class ExpandingButton extends React.Component<{ onClick: () => void, contentVisible: boolean, buttonText: string }> {
    render() {
        return <button className="w-full bg-gray-500 text-white mt-2 py-2 px-4"
                       onClick={this.props.onClick}>
            <div className="grid grid-cols-6">
                <div className="col-start-1 col-span-5 place-self-start">
                    {this.props.buttonText}
                </div>
                <div className="col-start-6 place-self-end"><ChevronButtonIcon
                    contentVisible={this.props.contentVisible}/></div>
            </div>
        </button>;
    }
}