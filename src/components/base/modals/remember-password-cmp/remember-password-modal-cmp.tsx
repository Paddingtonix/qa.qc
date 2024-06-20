import "./style.sass"
import React from "react";
import {ModalContentProps} from "../modal-cmp";
import dogImage from "./../../../../assets/images/dog.jpg";

const RememberPasswordModalCmp = (props: ModalContentProps) => {

    const {changeModalContent} = props;

    return (
        <div className={"remember-password-modal"}>
            <h5>ЗАБЫЛИ ПАРОЛЬ?</h5>
            <span>Напишите нашему доверенному <br/> лицу в Телеграмм!</span>
            <a className={"remember-password-modal__contact"} href={"https://t.me/paddingx"} target={"_blank"}>
                <img alt={"Ярик"} src={dogImage}/>
                <h5>Ярослав</h5>
                <span>@paddingx</span>
            </a>

            <div className={"remember-password-modal__to-login"}>
                <span onClick={() => changeModalContent("loginForm")}>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Вернуться
                </span>
            </div>
        </div>
    )
}

export default RememberPasswordModalCmp;