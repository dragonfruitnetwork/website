import React, {ReactElement} from "react";
import {LuBug, LuCheck, LuClock, LuInfo, LuMinus, LuPlus, LuShield} from "react-icons/lu";

export function EntryTypeIcon(props: { type: "ADDITION" | "FIX" | "REMOVAL" | "DELAYED" | "INFO" | "BUG" | "SECURITY" | null }): ReactElement<any> {
    switch (props.type) {
        case "ADDITION":
            return <LuPlus/>;

        case "FIX":
            return <LuCheck/>;

        case "REMOVAL":
            return <LuMinus/>;

        case "BUG":
            return <LuBug/>;

        case "DELAYED":
            return <LuClock/>;

        case "INFO":
            return <LuInfo/>;

        case "SECURITY":
            return <LuShield/>;

        default:
            return <></>;
    }
}