import React, {useCallback, useState} from "react";

export type FormField = {
    type: "text" | "password" | "number" | "email",
    name: string,
    label: string,
    value: string,
    isRequired?: boolean,
    pattern?: string
}

export function useForm(formFields: FormField[]) {

    //Поля формы
    const [fields, setFields] = useState<FormField[]>(formFields);
    //Флаг, что форму необходимо провалидировать
    const [checkForm, setCheckForm] = useState(false);

    //Установка нового значения полю формы
    const setFieldValue = useCallback((value: string, name: string) => {
        const updateForm = fields.map(field => {
            if (field.name !== name) return field;
            else {
                return {
                    ...field,
                    value: value,
                };
            }
        });
        setFields(updateForm);
    }, [fields])

    //Обработчик сбора формы
    const handleSubmit = useCallback((callback: (data: any) => void) => (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCheckForm(true);

        //Валидация формы
        const isCheckFailed = fields.findIndex(it => {
            if (it.isRequired && !it.value)
                return true;
            else if (it.pattern && !(new RegExp(it.pattern).test(it.value)))
                return true;
            return false;
        })

        //При успешной проверке пробешаемся по всем полям формы и формирем объект с ключами-значениями,
        //затем отправялем сформированный объект в коллбэк
        if (isCheckFailed === -1) {
            let object = {};
            fields.forEach(it =>
                Object.assign(object, { [it.name]: it.value })
            )
            callback(object);
        }
    }, [fields]);

    return {
        fields,
        checkForm,
        handleSubmit,
        setFieldValue,
    }
}
