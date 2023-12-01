import React, { useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";   
import "../../node_modules/primeflex/primeflex.css"
import "primereact/resources/primereact.min.css";  



import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Login() {
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  function help(){ //helpuyu
    return <></>
  }
  return (
    <>
    <div className='flex justify-content-center'>
        <Card className='mt-6' style={{width: '25rem', backgroundColor: "var(--dark-background-color)"}}>
            <p style={{color: 'var(--headers-color)'}} className="text-center text-xl font-medium mt-0">Вход в систему</p>
            <form className='mt-5'>
                <div className='field' name="email">
                    <div className="field">
                        <span className="p-float-label">
                            <InputText style={{width: "100%"}} id="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label style={{color: 'var(--text-color)'}} htmlFor="Email">Email</label>
                        </span>
                    </div>
                </div>

                <div class="field mt-4">
                    <span className="p-float-label">
                        <Password style={{width: "100%"}} className="" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} id="password"/>
                        <label style={{color: 'var(--text-color)'}} htmlFor="password">Пароль</label>
                    </span>
                </div>

                <Button className="mt-2" label="Войти" style={{width: "100%", backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)"}} />
            </form>
        </Card>
    </div>
    </>
  );
}

