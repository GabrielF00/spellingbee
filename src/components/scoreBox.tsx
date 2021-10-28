import React from "react";

export class ScoreBox extends React.Component<{ score: number, caption: string, hide_caption: boolean }> {
    render() {
        const captionBox = this.props.hide_caption ? null : <p className="text-xs text-center">{this.props.caption}</p>;
        return <div>
            <div className="bg-gray-700 text-white font-bold py-2 px-4">
                <p className="score_box text-center">{this.props.score}</p>
            </div>
            {captionBox}
        </div>
    }
}