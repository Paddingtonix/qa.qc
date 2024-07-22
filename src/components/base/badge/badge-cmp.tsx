import "./style.sass"
import {ReactNode} from "react";

interface Props {
    children?: ReactNode,
    type?: "primary" | "default"
}


const BadgeCmp = ({children, type = "default"}: Props) => {
    return (
        <span className={`badge-cmp badge-cmp_${type}`}>{children}</span>
    )
}

export default BadgeCmp;