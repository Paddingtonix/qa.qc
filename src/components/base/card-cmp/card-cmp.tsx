import "./style.sass"
import {ReactNode} from "react";

interface CardProps {
    children?: ReactNode,
    className?: string,
    href?: string
}

const CardCmp = ({children, className, href}: CardProps) => {
    return (
        href
            ? <a href={href} className={`card-cmp ${className}`}>{children}</a>
            : <div className={`card-cmp ${className}`}>
                {children}
            </div>
    )
}

export default CardCmp;