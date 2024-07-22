import React, { MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import "./style.sass"
import {createPortal} from "react-dom";
import LoginModalCmp from "./login-cmp/login-modal-cmp";
import RememberPasswordModalCmp from "./remember-password-cmp/remember-password-modal-cmp";
import RegisterModalCmp from "./register-cmp/register-modal-cmp";

interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    withCloseButton?: boolean,
    closable?: boolean,
    modalContent?: ModalContent
}

export interface ModalContentProps {
    changeModalContent(content: ModalContent): void
}

type ModalContent = "loginForm" | "rememberPassword" | "register" | "custom";

const ANIMATION_DELAY = 300;

const ModalCmp = (props: ModalProps) => {
    const {
        children,
        isOpen,
        onClose,
        closable = true,
        withCloseButton = true,
        modalContent: modalContentProps = "custom"
    } = props;

    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>(modalContentProps);
    const timerRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>;

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        }
    }, [isOpen]);

    const closeHandler = useCallback(() => {
        if (onClose) {
            setIsClosing(true);
            timerRef.current = setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, ANIMATION_DELAY);
        }
    }, [onClose]);


    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeHandler();
        }
    }, [closeHandler]);

    const onContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const onOverlayClick = useCallback((e: React.MouseEvent) => {
        if (!closable)
            e.stopPropagation();
        else closeHandler()
    }, [closable]);

    useEffect(() => {
        if (isOpen && closable) {
            window.addEventListener('keydown', onKeyDown);
        }

        return () => {
            clearTimeout(timerRef.current);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onKeyDown, closable]);

    const changeModalContent = useCallback((content: ModalContent) => {
        setModalContent(content);
    }, []);

    if (!isMounted) {
        return null;
    }

    const ModalContentComponents: Record<ModalContent, React.ReactNode> = {
        "loginForm": <LoginModalCmp changeModalContent={changeModalContent}/>,
        "rememberPassword": <RememberPasswordModalCmp changeModalContent={changeModalContent}/>,
        "register": <RegisterModalCmp changeModalContent={changeModalContent}/>,
        "custom": children
    }

    return createPortal(
        <div className={`modal-basic ${isOpen && "modal-basic_opened"} ${isClosing && "modal-basic_closing"}`}>
            <div className={"modal-basic__overlay"} onClick={onOverlayClick}>
                <div
                    className={"modal-basic__overlay__content"}
                    onClick={onContentClick}
                >
                    { ModalContentComponents[modalContent] }
                    {
                        withCloseButton &&
                        <div className={"modal-basic__overlay__content__close-button"}
                             onClick={closeHandler}
                        />
                    }
                </div>
            </div>
        </div>
    , document.body);
};

export default ModalCmp;