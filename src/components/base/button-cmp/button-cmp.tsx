import {ReactNode} from "react";
import "./style.sass"

interface Props {
    name?: string,
    disabled?: boolean,
    children?: ReactNode
    type?: "primary" | "secondary"

    onClick?(): void,
}

export const ButtonCmp = (props: Props) => {

    const {
        name,
        disabled,
        children,
        type = "primary",
        onClick
    } = props;

    return (
        <button
            className={`button button_${type}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children || name}
        </button>
    )
}


