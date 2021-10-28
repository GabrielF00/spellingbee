import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/solid";
import React from "react";

interface ChevronButtonIconProps {
    contentVisible: boolean
}

export function ChevronButtonIcon(props: ChevronButtonIconProps) {
    if (props.contentVisible) {
        return (
            <ChevronUpIcon className={"h-5 w-5"}/>
        )
    } else {
        return (
            <ChevronDownIcon className={"h-5 w-5"}/>
        )
    }
}