import "./style.sass"
import React, {useEffect, useState} from "react";
import ModalCmp from "../../components/base/modals/modal-cmp";
import {useAuth} from "../../utils/AuthProvider";
import ProjectsPage from "../projects-page/projects-page";

type DisplayOption = "login" | "loaded_data";

const StartDataPage = () => {

    const {isAuth} = useAuth();
    const [displayOption, setDisplayOption]
        = useState<DisplayOption>(isAuth ? "loaded_data" : "login");

    useEffect(() => {
        setDisplayOption(isAuth ? "loaded_data" : "login");
    }, [isAuth]);

    return (
        displayOption === "login"
            ? <ModalCmp isOpen={true} closable={false} withCloseButton={false} modalContent={"loginForm"}/>
            : <ProjectsPage/>
    )
}

export default StartDataPage;