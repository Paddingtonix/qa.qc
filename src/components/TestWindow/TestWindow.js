import React, { useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";   
import "../../../node_modules/primeflex/primeflex.css"
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import "primereact/resources/primereact.min.css";  
import 'primeicons/primeicons.css';
import "../../index.scss"

const TestWindow = ({active, setActive, children}) => {
    return (
        <div className={active ? 'modal active' : "modal closed"}>
            <div className={active? "content act" : "cls content"}>
                {children}
            </div>
        </div>
    )
}

export default TestWindow

