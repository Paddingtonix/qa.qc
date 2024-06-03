import "../../index.scss"

interface Props{
    OnClick:  any,
    name: string,
    disabled?: boolean
}

export const ButtonCmp =({OnClick, name, disabled}: Props) => {

    return (
        <button className='button' onClick={OnClick} disabled={disabled}>{name}</button>
    )
}


