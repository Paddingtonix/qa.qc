import "./style.sass"

interface Props {
    size?: "small" | "large"
}

const LoaderCmp = ({size = "large"}: Props) => {
    return (
        <span className={`loader-cmp loader-cmp_${size}`}/>
    )
}

export default LoaderCmp;