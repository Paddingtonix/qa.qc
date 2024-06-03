import React from 'react';
import "../../index.scss"


import { useState, useEffect, useRef } from 'react';
import { ButtonCmp } from '../button-cmp/button-cmp';
import { CheckboxCmp } from '../checkbox-cmp/checkbox-cmp';
import axios from "axios";

interface Props {
    nameNodes: string,
    modalState: Function
}

export const SidebarCmp = ({ nameNodes, modalState }: Props) => {
    const [splitNameNodes, setSplitNameNodes] = useState<{ text: string; type: string}[]>([
        {
            text: '',
            type: '',
        }
    ]);



    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [stepModal, setStepModal] = useState(1) as any

    const [testsModal, setTestsModal] = useState({
        document: 'text',
        vertex_test: [
            {
                name: "Тест первого порядка",
                success: true,
                id: 1
            },
            {
                name: "Тест второго порядка",
                success: true,
                id: 2
            },
            {
                name: "Тест третьего порядка",
                success: false,
                id: 3
            }
        ],
        edges_test: [
            {
                name: "Тест первого порядка",
                success: false,
                id: 4
            },
            {
                name: "Тест второго порядка",
                success: false,
                id: 5
            },
            {
                name: "Тест третьего порядка",
                success: false,
                id: 6
            }
        ]
    }) as any



    useEffect(() => {
        SplitName(nameNodes);
    }, [nameNodes]);

    function SplitName(nameNodes: string) {
        let splitStr = nameNodes.split('|');
        let array = splitStr.slice(0, -1).map((value, index) => ({
            text: value,
            type: index === 0 ? 'Наименование' : index === 1 ? 'Формат' : 'Домен'
        }));
        setSplitNameNodes(array);
    }

    const handleFileChange = (event: any) => {

        const file = event.target.files[0];
        setSelectedFile(file);
    };

    useEffect(() => {
        axios
            .get('http://localhost:3000/test/api/tests.json')
            .then(response_test => {
                setTestsModal(response_test.data);
            })
    }, [])


    function nextStep() {
        switch (stepModal) {
            case 1:
                setStepModal(2)
                break;

            case 2:
                setStepModal(3)
                break;

            default:
                break;
        }
    }

    function prevStep() {
        setStepModal(2)
    }

    function closeModal() {
        modalState(false)
    }

    function uploadData() {
        if (selectedFile) {
            const fd = new FormData();
            fd.append('file', selectedFile);

            axios
                .get('/api/success.json')
                .then((response) => {
                    console.log(response);

                    if(response.data) {
                        setStepModal(2)
                    }
                })
        } else {
            if (fileInputRef && fileInputRef.current) {
                fileInputRef.current.click();
            }
        }
    }




    return (
        <div className="modal">
            <div className='modal__navigation'>
                {
                    stepModal === 3 ?
                        <div className='modal__navigation__back' onClick={prevStep}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.83 11L11.41 7.41L10 6L4 12L10 18L11.41 16.59L7.83 13H20V11H7.83Z" fill="#ffffff "/>
                            </svg>
                        </div>
                        :
                        ''
                }

                <div className="modal__navigation__close" onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z" fill="#ffffff" />
                    </svg>
                </div>
            </div>
            <div className='modal__title'>
                {splitNameNodes.map((name) => (
                    <div className='modal__title__container' key={name.text}>
                        <span className='modal__title__text'>{name.type}:</span>
                        <span className='modal__title__text'>{name.text}</span>
                    </div>
                ))}
            </div>
            {stepModal === 1 ?
                <div className='modal__btn'>
                    <ButtonCmp OnClick={nextStep} name={!selectedFile ? 'Загрузить данные' : 'Отправить файл'}></ButtonCmp>
                    <input id='fileUpload' type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                </div>
                :
                ''
            }
            {stepModal === 2 &&
                <>
                    <div className='modal__tests'>
                        <h2 className='modal__tests__title'>Данные</h2>
                        <div className='modal__tests__container'>
                            <span className='modal__tests__text'>Файл: {testsModal.document}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="#ffffff"/>
                            </svg>
                        </div>
                        <h2 className='modal__tests__title'>Тесты для рёбер</h2>
                        <div className='modal__tests__container__test'>
                            {testsModal.edges_test.map((test: any) => {
                                return (
                                    <>
                                        <div className='modal__tests__container'>
                                            <CheckboxCmp
                                                OnClick={undefined} name={test.name}
                                            ></CheckboxCmp>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                        <h2 className='modal__tests__title'>Тесты для вершин</h2>
                        <div className='modal__tests__container__test'>
                            {testsModal.vertex_test.map((test: any) => {
                                return (
                                    <>
                                        <div className='modal__tests__container'>
                                            <CheckboxCmp
                                                OnClick={undefined} name={test.name}
                                            ></CheckboxCmp>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    {stepModal === 1 ?
                        (
                            <div className='modal__btn'>
                                <ButtonCmp OnClick={nextStep} name={!selectedFile ? 'Загрузить данные' : 'Отправить файл'}></ButtonCmp>
                                <input id='fileUpload' type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                            </div>
                        )
                        :
                        (
                            <div className='modal__btn'>
                                <ButtonCmp OnClick={nextStep} name={'Начать тестирование'}></ButtonCmp>
                                <input id='fileUpload' type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                            </div>
                        )
                    }
                </>
            }
            {
                stepModal === 3 &&
                <>
                    <div className='modal__tests__success'>
                        <h2 className='modal__tests__title'>Тесты для рёбер</h2>
                        {testsModal.edges_test.map((name: any) => (
                            <div className='modal__title__container' key={name.id}>
                                <span className='modal__title__text'>{name.name}</span>
                                {name.success ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.8389 6.69459L8.81811 18.7154L3.16125 13.0586L4.57125 11.6486L8.81811 15.8854L19.4289 5.28459L20.8389 6.69459Z" fill="#3FBAC2"/>
                                    </svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 22H10V19H13V22ZM13 17H10V16.993C10 15.343 10 13.918 10.672 12.92C11.1948 12.2574 11.8453 11.7065 12.585 11.3C12.919 11.086 13.234 10.883 13.499 10.672C14.6604 9.77306 15.1826 8.27392 14.831 6.84799C14.2747 5.51815 12.8593 4.76357 11.4451 5.04296C10.0309 5.32236 9.00877 6.55851 9 7.99999H6C6 4.68629 8.68629 1.99997 12 1.99997C14.3053 1.99307 16.4134 3.29894 17.434 5.36599C18.3507 7.47212 17.9883 9.91642 16.5 11.666C16.0475 12.1675 15.5396 12.616 14.986 13.003C14.5016 13.3371 14.0597 13.729 13.67 14.17C13.1193 15.0045 12.8819 16.0071 13 17Z" fill="#f50f02"/>
                                    </svg>
                                }

                            </div>
                        ))}
                        <h2 className='modal__tests__title'>Тесты для вершин</h2>
                        {testsModal.vertex_test.map((name: any) => (
                            <div className='modal__title__container' key={name.id}>
                                <span className='modal__title__text'>{name.name}</span>
                                {name.success ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.8389 6.69459L8.81811 18.7154L3.16125 13.0586L4.57125 11.6486L8.81811 15.8854L19.4289 5.28459L20.8389 6.69459Z" fill="#3FBAC2"/>
                                    </svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 22H10V19H13V22ZM13 17H10V16.993C10 15.343 10 13.918 10.672 12.92C11.1948 12.2574 11.8453 11.7065 12.585 11.3C12.919 11.086 13.234 10.883 13.499 10.672C14.6604 9.77306 15.1826 8.27392 14.831 6.84799C14.2747 5.51815 12.8593 4.76357 11.4451 5.04296C10.0309 5.32236 9.00877 6.55851 9 7.99999H6C6 4.68629 8.68629 1.99997 12 1.99997C14.3053 1.99307 16.4134 3.29894 17.434 5.36599C18.3507 7.47212 17.9883 9.91642 16.5 11.666C16.0475 12.1675 15.5396 12.616 14.986 13.003C14.5016 13.3371 14.0597 13.729 13.67 14.17C13.1193 15.0045 12.8819 16.0071 13 17Z" fill="#f50f02"/>
                                    </svg>
                                }

                            </div>
                        ))}
                    </div>
                    <ButtonCmp OnClick={uploadData} name={'Скачать отчёт'}></ButtonCmp>
                </>
            }
        </div>
    );
};

