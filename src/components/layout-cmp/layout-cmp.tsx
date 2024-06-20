import "./style.sass"
import {ReactNode} from "react";
import AccountCmp from "../account-cmp/account-cmp";
import {Link} from "react-router-dom";
import {Links} from "../../App";

interface Props {
    children?: ReactNode
}

const LayoutCmp = ({children}: Props) => {

    const HeaderMenuItems = [
        {title: "Проекты", link: Links.Start}
    ]

    return (
        <div className={"layout-cmp"}>
            <div className={"layout-header"}>
                <div className={"layout-header__content"}>
                    <div>
                        <Link to={Links.Start} className={"layout-header__logo"}>
                            <h5>QA</h5><span>\</span><h5>QC</h5>
                        </Link>
                        <ul>
                            {
                                HeaderMenuItems.map(link =>
                                    <li key={link.link}>
                                        <Link to={link.link}>{link.title}</Link>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <AccountCmp/>
                </div>
            </div>
            <div className={"layout-content"}>
                {children}
            </div>
        </div>
    )
}

export default LayoutCmp;