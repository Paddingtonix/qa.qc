import {useAuth} from "../../../../utils/providers/AuthProvider";
import React, {useState} from "react";
import {RegisterCredentials, service} from "../../../../utils/api/service";
import {useMutation} from "@tanstack/react-query";
import "./../login-cmp/style.sass"
import {FormField, useForm} from "../../../../utils/hooks/use-form";
import {ModalContentProps} from "../modal-cmp";
import {useNotification} from "../../notification/notification-provider";
import InputCmp from "../../input-cmp/input-cmp";
import {CheckboxCmp} from "../../checkbox-cmp/checkbox-cmp";
import {ButtonCmp} from "../../button-cmp/button-cmp";


const RegisterModalCmp = (props: ModalContentProps) => {
    const {changeModalContent} = props;
    const {signIn} = useAuth();
    const {toastSuccess, toastError} = useNotification();
    const [rememberMe, setRememberMe] = useState(false);

    const {fields, checkForm, setFieldValue, handleSubmit} = useForm(FormRegister);

    const {mutate: register, isPending, error} = useMutation({
        mutationFn: (data: RegisterCredentials) => service.register(data),
        onSuccess: ({data}) => {
            signIn(data.auth_token, data.refresh_token, rememberMe);
            toastSuccess("Вы успешно вошли в систему!")
        },
        onError: () => {
            toastError("Ошибка")
        }
    });

    const onSubmit = (data: RegisterCredentials) => {
        register(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"login-modal"}>
            <h5>РЕГИСТРАЦИЯ</h5>
            {
                fields.map(field =>
                    <InputCmp
                        value={field.value}
                        onChange={(value) => setFieldValue(value, field.name)}
                        label={field.label}
                        name={field.name}
                        isRequired={field.isRequired}
                        type={field.type}
                        checkRules={checkForm}
                        key={field.name}
                    />
                )
            }
            <span className={"login-modal__remember-me"}>
                <CheckboxCmp onClick={() => setRememberMe(!rememberMe)}/>
                Запомнить меня
            </span>
            <ButtonCmp disabled={isPending}>Зарегистрироваться</ButtonCmp>
            <div className={"login-modal__forgot-password"}>
                <span onClick={() => changeModalContent("loginForm")}>
                    Уже есть аккаунт
                </span>
            </div>
        </form>
    )
}

const FormRegister: FormField[] = [
    {
        type: "text",
        name: "name",
        label: "Имя",
        value: "",
        isRequired: true
    },
    {
        type: "email",
        name: "email",
        label: "Почта",
        value: "",
        isRequired: true
    },
    {
        type: "password",
        name: "password",
        label: "Пароль",
        value: "",
        isRequired: true
    },
]

export default RegisterModalCmp;