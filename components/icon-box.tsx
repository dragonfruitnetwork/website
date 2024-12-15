import React from "react";
import {darken, lighten} from "polished";

export function IconBox(props: {
    icon: React.ReactElement,
    color: string,
    size?: number
}) {
    const iconColor = darken(0.2, props.color);
    const iconSize = props.size || 64;

    return (
        <div className="flex items-center justify-center rounded-md p-5 outline-none" style={{backgroundColor: props.color, width: iconSize * 1.5, height: iconSize * 1.5}}>
            {React.cloneElement(props.icon, {size: iconSize, color: iconColor})}
        </div>
    );
}