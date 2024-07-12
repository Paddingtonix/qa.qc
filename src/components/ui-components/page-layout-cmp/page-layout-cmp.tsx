import "./style.sass"
import {ReactNode} from "react";
import {Link} from "react-router-dom";
import {RouterLinks} from "../../../App";
import AccountCmp from "./../account-cmp/account-cmp";

interface Props {
    children?: ReactNode
}

const PageLayoutCmp = ({children}: Props) => {

    const HeaderMenuItems = [
        { title: "Проекты", link: RouterLinks.Start }
    ]

    return (
        <div className={"layout-cmp"}>
            <div className={"layout-header"}>
                <div className={"layout-header__content"}>
                    <div>
                        <Link to={RouterLinks.Start} className={"layout-header__logo"}>
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

export default PageLayoutCmp;