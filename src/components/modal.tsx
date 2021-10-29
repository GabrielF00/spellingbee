import React from "react";

export function Modal(props: { title: string, content: string, closeCallback: () => void }) {
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
                        <button className="btn-gray" onClick={props.closeCallback}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}