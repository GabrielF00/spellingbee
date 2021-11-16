import React from "react";

export function ErrorAlert(props: { errorMessage: string }) {
    const errorDisplayClass = props.errorMessage === '' ? "hidden" : "block";

    return <div className={"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative " + errorDisplayClass} role="alert">
        <strong className="font-bold">{props.errorMessage}</strong>
    </div>;
}