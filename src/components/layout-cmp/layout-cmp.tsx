import "./style.sass"
import {ReactNode} from "react";
import AccountCmp from "../account-cmp/account-cmp";
import {Link} from "react-router-dom";
import {Links} from "../../App";

interface Props {
    children?: ReactNode
}

const LayoutCmp = ({children}: Props) => {
    return (
        <div className={"layout-cmp"}>
            <div className={"layout-header"}>
                <div className={"layout-header__content"}>
                    <Link to={Links.Start} className={"layout-header__logo"}>
                        <h5>QA</h5><span>\</span><h5>QC</h5>
                    </Link>
                    <AccountCmp/>
                </div>
            </div>
            {children}
        </div>
    )
}

export default LayoutCmp;