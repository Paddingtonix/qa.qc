import {ReactNode} from "react";
import "./style.sass"

interface Props {
    name?: string,
    disabled?: boolean,
    children?: ReactNode

    onClick?(): void,
}

export const ButtonCmp = (props: Props) => {

    const {
        name,
        disabled,
        children,
        onClick
    } = props;

    return (
        <button className='button' onClick={onClick} disabled={disabled}>{children || name}</button>
    )
}


