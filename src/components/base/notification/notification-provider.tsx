import "./style.sass"
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {createPortal} from "react-dom";

interface NotificationProviderProps {
    children: React.ReactNode
}

export type NotificationType = "warning" | "success" | "error";

const TIME_TO_DELETE = 300; //Длительность периода времени перед удалением уведомления
const MAX_COUNT = 4; //Максимальное кол-во уведомлений

//Настройи параметров уведомлений
const NotificationOptions = {
    success: {
        autoClose: true,
        timeToClose: 5000
    },
    error: {
        autoClose: true,
        timeToClose: 5000
    },
    warning: {
        autoClose: false,
        timeToClose: 10000
    }
}

export const NotificationProvider = ({children}: NotificationProviderProps) => {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    //Обеспечивает уникальность индекса уведомления
    const [index, setIndex] = useState(0);

    //Добавление уведомления
    const createNotification = (options: CreateNotification) => {
        setNotifications([
            ...notifications,
            {
                ...options,
                id: index,
            },
        ])
        setIndex(index + 1);
    };

    //Удаление уведомления
    const deleteNotification = useCallback((id: number) => {
        const filteredNotifications = notifications.filter(
            notification => id !== notification.id
        );
        setNotifications(filteredNotifications);
    }, [notifications]);

    //Вызвать уведомление об успехе
    const toastSuccess = (text?: string) => {
        createNotification({type: "success", ...NotificationOptions.success, children: text})
    }

    //Вызвать уведомление об ошибке
    const toastError = (text?: string) => {
        createNotification({type: "error", ...NotificationOptions.error, children: text})
    }

    //Вызвать уведомление с предупреждением
    const toastWarning = (text?: string) => {
        createNotification({type: "warning", ...NotificationOptions.warning, children: text})
    }

    const value = {
        toastSuccess,
        toastError,
        toastWarning
    }

    return (
        <NotificationContext.Provider value={value}>
            {
                notifications.map((notification, index) => (
                    <NotificationCmp
                        key={notification.id}
                        onDelete={deleteNotification}
                        forcedClose={notifications.length > MAX_COUNT && index < notifications.length - MAX_COUNT}
                        {...notification}
                    />
                ))
            }
            {children}
        </NotificationContext.Provider>
    )
}

export interface NotificationContextValue {
    toastSuccess(text?: string): void,

    toastError(text?: string): void,

    toastWarning(text?: string): void,
}

const defaultValue: NotificationContextValue = {
    toastSuccess() {},
    toastError() {},
    toastWarning() {}
}

export const NotificationContext = createContext<NotificationContextValue>(defaultValue);

export const useNotification = () => {
    return useContext(NotificationContext);
}

interface NotificationCmpProps {
    id: number,
    type?: NotificationType,
    children?: React.ReactNode,
    autoClose?: boolean,
    forcedClose?: boolean,
    timeToClose?: number

    onDelete(id: number): void,
}

type CreateNotification = Omit<Notification, "id">;

type Notification = {
    id: number
    type?: NotificationType,
    children?: React.ReactNode,
    autoClose?: boolean,
    timeToClose?: number
}

const NotificationCmp = (props: NotificationCmpProps) => {

    const {
        id,
        type = "success",
        autoClose = true,
        timeToClose = 5000,
        forcedClose = false,
        children,
        onDelete
    } = props;

    const [isClosing, setIsClosing] = React.useState(false);

    //Отслеживает, был ли вызван триггер закрытия. В позитивном случае по прошествии времени удаляет уведомление
    useEffect(() => {
        if (isClosing) {
            const timeoutId = setTimeout(() => onDelete(id), TIME_TO_DELETE);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [isClosing, onDelete]);


    //Отслеживает, необходимо ли принудительно(досрочно) закрыть уведомление
    useEffect(() => {
        if (forcedClose) setIsClosing(true);
    }, [forcedClose]);

    //Отслеживает, необходимо ли авто-закрытие. В позитивном случае по прошествии времени триггерит закрытие
    useEffect(() => {
        if (autoClose) {
            const timeoutId = setTimeout(() => setIsClosing(true), timeToClose);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [autoClose]);

    return createPortal(
        <div className={`notification-cmp ${isClosing ? "notification-cmp_shrink" : ""}`}>
            <div
                className={`content content_${type} ${isClosing ? "content_slide-out" : "content_slide-in"}`}>
                <span className={"content__icon"}>
                    {NotificationIcon[type]}
                </span>
                {children}
                <button className={"content__close-button"} onClick={() => setIsClosing(true)}>
                    <svg width="24" height="24" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
                            fill="#000000"/>
                    </svg>
                </button>
            </div>
        </div>
        , createContainer()
    );
}

const NotificationIcon: Record<NotificationType, React.ReactNode> = {
    "warning": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C10.896 21.9946 10.0009 21.1039 9.99 20H13.99C13.9921 20.2674 13.9411 20.5325 13.84 20.78C13.5777 21.382 13.0418 21.8211 12.4 21.96H12.395H12.38H12.362H12.353C12.2368 21.9842 12.1186 21.9976 12 22ZM20 19H4V17L6 16V10.5C5.94732 9.08912 6.26594 7.68913 6.924 6.44C7.57904 5.28151 8.6987 4.45888 10 4.18V2H14V4.18C16.579 4.794 18 7.038 18 10.5V16L20 17V19Z" fill="#2E3A59"/>
                </svg>,
    "success": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C21.9939 17.5203 17.5203 21.9939 12 22ZM11.984 20H12C16.4167 19.9956 19.9942 16.4127 19.992 11.996C19.9898 7.57929 16.4087 4 11.992 4C7.57528 4 3.99421 7.57929 3.992 11.996C3.98979 16.4127 7.56729 19.9956 11.984 20ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#2E3A59"/>
                </svg>,
    "error": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.99 22C6.46846 21.9945 1.99632 17.5149 2 11.9933C2.00368 6.47179 6.48179 1.99816 12.0033 2C17.5249 2.00184 22 6.47845 22 12C21.9967 17.5254 17.5154 22.0022 11.99 22ZM4 12.172C4.04732 16.5732 7.64111 20.1095 12.0425 20.086C16.444 20.0622 19.9995 16.4875 19.9995 12.086C19.9995 7.6845 16.444 4.10977 12.0425 4.08599C7.64111 4.06245 4.04732 7.59876 4 12V12.172ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#2E3A59"/>
            </svg>
}

const createContainer = () => {
    //Проверяем, существует ли контейнер для уведомлений
    const portalId = "notification-container";
    let element = document.getElementById(portalId);

    if (element) return element;

    //В отрицательном случае создаём и добавляем его
    element = document.createElement("div");
    element.setAttribute("id", portalId);
    element.className = "notification-container";
    document.body.appendChild(element);
    return element;
}