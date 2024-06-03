import "../../index.scss";
import "./style.scss"
import React, {useState} from "react";

interface TooltipProps {
    text?: string,
    direction?: TooltipDirection
    children?: React.ReactNode
}

export type TooltipDirection = "left" | "right" | "top" | "bottom" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom" | "bottomLeft" | "bottomRight";

const TooltipCmp = (props: TooltipProps) => {

    const {
        text,
        direction = "topRight",
        children
    } = props;

    const [show, setShow] = useState(false);
    const onMouseMoveHandler = (isEnter: boolean) => {
        setShow(isEnter);
    }

    return (
        <div
            className={`tooltip tooltip_direction_${direction} ${show ? "tooltip_show" : ""}`}
            onMouseEnter={() => onMouseMoveHandler(true)}
            onMouseLeave={() => onMouseMoveHandler(false)}
        >
            { children }
            { show &&
                <div className={`tooltip__text tooltip__text_direction_${direction}`}>
                    {text}
                </div>
            }
        </div>
    )
}

export default TooltipCmp;