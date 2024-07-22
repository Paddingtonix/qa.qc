import React, {useState} from "react";
import "./style.sass"
import {useAuth} from "../../../utils/providers/AuthProvider";
import {useOutsideClick} from "../../../utils/hooks/use-outside-click";

const AccountCmp = () => {

    const [isOpen, setIsOpen] = useState(false);
    const {signOut} = useAuth();
    const ref = useOutsideClick(() => {
        setIsOpen(false);
    });

    return (
        <div className={"personal-account-dropdown"} ref={ref}>
            <div className={`personal-account-dropdown__panel ${isOpen && "personal-account-dropdown__panel_open"}`}
                 onClick={() => setIsOpen(!isOpen)}
            >
                <span>user_name</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.51501 8.465L12 16.95L20.485 8.465L19.071 7.05L12 14.122L4.92901 7.05L3.51501 8.465Z"/>
                </svg>
            </div>
            {
                isOpen &&
                <div className={"personal-account-dropdown__list"}>
                    <ul>
                        <li onClick={() => signOut()}>
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12L13 12" stroke="white" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path
                                    d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Выйти
                        </li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default AccountCmp;