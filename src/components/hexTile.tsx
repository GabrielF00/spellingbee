import React from "react";

export interface HexTileProps {
    letter: String,
    tileOnClick: any
}

export function HexTile(props: HexTileProps) {
    return (
        <li>
            <div className="hexagon" onClick={() => props.tileOnClick(props.letter)}>
                <p className="text-xl uppercase font-semibold">{props.letter}</p>
            </div>
        </li>
    )
}