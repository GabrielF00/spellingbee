import {MPGameWord} from "spellbee";
import React from "react";

export function FoundWord(props: { i: MPGameWord, playerColor: string, isMultiplayer: boolean }) {

    const playerDot = props.isMultiplayer ?
        <div className={"rounded-full h-2 w-2 inline-block " + props.playerColor}/> : null;

    return <li>
        <span className={props.i.is_pangram ? "underline font-bold" : ""}>{props.i.word}</span>
        &nbsp;
        {playerDot}
    </li>;
}