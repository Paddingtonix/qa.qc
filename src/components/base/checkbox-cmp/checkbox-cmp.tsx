import { useState } from "react";
import "./style.sass"

interface Props{
    name?: string,
    onClick?(): void
}

export const CheckboxCmp = (props: Props) => {

    const {name, onClick} = props;

    const [active, setActive] = useState(false)
    function onSelect() {
        if (onClick) onClick();
        setActive(!active);
    }

    return (
        <div className='checkbox' onClick={onSelect}>
            <span>{name}</span>
            <div className="checkbox__frame">
                {active ?
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.52495 17.657L4.57495 12.707L5.98895 11.293L9.52645 14.8265L9.52495 14.828L18.01 6.343L19.424 7.757L10.939 16.243L9.52595 17.656L9.52495 17.657Z" fill="#ffffff"/>
                    </svg>
                : undefined}
            </div>
        </div>
    )
}


