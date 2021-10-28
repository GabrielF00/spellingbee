import {FoundWord} from "./foundWord";
import React from "react";
import {MPGameWord} from "spellbee";

interface FoundWordsListProps {
    foundWords: MPGameWord[],
    foundWordsVisible: boolean,
    scores: Record<string, number>,
    isMultiplayer: boolean
}

export function FoundWordsList(props: FoundWordsListProps) {
    const displayClass = props.foundWordsVisible ? "block" : "hidden";

    const validPlayerColors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-300"];
    const players = Object.keys(props.scores);
    const playerColorMap: { [index: string]: string } = {};
    for (let i in players) {
        playerColorMap[players[i]] = validPlayerColors[i];
    }

    const foundWordsDisp: Array<JSX.Element> = [];
    for (let i of props.foundWords.sort((a, b) => a.word.localeCompare(b.word))) {
        foundWordsDisp.push(
            <FoundWord key={i.word} i={i} playerColor={playerColorMap[i.player]} isMultiplayer={props.isMultiplayer}/>
        )
    }
    const playersDisp: Array<JSX.Element> = [];
    if (props.isMultiplayer) {
        for (let i of players) {
            playersDisp.push(<div className="" key={i}>
                <div className={"rounded-full h-2 w-2 inline-block " + playerColorMap[i]}/>
                <span>&nbsp;{i + " : " + props.scores[i]} </span></div>);
        }
    }
    return (
        <div className={"absolute z-40 bg-white w-full h-full border-2 overscroll-auto overflow-auto " + displayClass}>
            <div>
                <ul className="list-disc list-inside p-2 col-count-2">
                    {foundWordsDisp}
                </ul>
            </div>
            <div>
                {playersDisp}
            </div>
        </div>
    )
}