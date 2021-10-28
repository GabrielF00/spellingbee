import {GameWord} from "spellbee";
import {CheckIcon} from "@heroicons/react/solid";
import React from "react";

interface EndGameScreenProps {
    endGameScreenVisible: boolean,
    foundWords: GameWord[],
    allWords: GameWord[],
    score: number,
    maxScore: number,
    rank: string,
    closeButtonHandler: any
}

export function EndGameScreen(props: EndGameScreenProps) {
    const displayClass = props.endGameScreenVisible ? "" : "hidden";
    const foundWordsSet = new Set(props.foundWords.map(word => word.word));
    const wordsDisp: Array<JSX.Element> = [];

    for (let i of props.allWords.sort((a, b) => a.word.localeCompare(b.word))) {
        wordsDisp.push(
            <li key={i.word}>
                <span className={i.is_pangram ? "underline font-bold" : ""}>
                    {i.word}
                </span>
                {foundWordsSet.has(i.word) && <CheckIcon className={"h-5 w-5 text-yellow-500 inline"}/>}
            </li>
        )
    }

    return (
        <div className={"absolute z-40 top-0 bg-white w-full h-full overscroll-auto overflow-auto " + displayClass}>
            <div className="w-full h-full space-y-2 flex flex-col">
                <h2 className="text-4xl text-center font-hairline md:leading-loose text-grey my-4">Game Over</h2>
                <p className="text-2xl text-center">Score: {props.score + " / " + props.maxScore}</p>
                <p className="text-2xl text-center">{props.rank}</p>
                <div className={"flex-1 overflow-auto overscroll-auto my-2"}>
                    <ul className="list-disc list-inside p-2 col-count-2">
                        {wordsDisp}
                    </ul>
                </div>
                <div className="mx-auto my-2">
                    <button className="btn-gray" onClick={props.closeButtonHandler}>
                        New Game
                    </button>
                </div>
            </div>
        </div>
    )
}