import React from "react";

interface ControlsProps {
    shuffleButtonOnClick: any
    deleteButtonOnClick: any
}

export function Controls(props: ControlsProps) {
    return (
        <div className="grid w-4/6 mx-auto grid-cols-2 justify-items-center">
            <div>
                <button className="btn-gray" onClick={props.shuffleButtonOnClick}>Shuffle</button>
            </div>
            <div>
                <button className="btn-gray" onClick={props.deleteButtonOnClick}>Delete</button>
            </div>
        </div>
    )
}