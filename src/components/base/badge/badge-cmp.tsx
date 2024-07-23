import "./style.sass"
import React, {ReactNode} from "react";

interface Props {
    children?: ReactNode,
    type?: "primary" | "default" | "ghost",
    className?: string,
    onClick?(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void
}


const BadgeCmp = ({children, type = "default", className, onClick}: Props) => {
    return (
        <span
            className={`badge-cmp badge-cmp_${type} ${className}`}
            onClick={(event) => onClick && onClick(event)}
        >{children}</span>
    )
}

export default BadgeCmp;