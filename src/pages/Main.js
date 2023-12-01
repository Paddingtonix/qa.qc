import React, { useState } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";   
import "../../node_modules/primeflex/primeflex.css"
import "primereact/resources/primereact.min.css"; 
import 'primeicons/primeicons.css'; 

import "../index.scss"

import TestWindow from '../components/TestWindow/TestWindow';

import Navbar from '../components/NavBar/Navbar';
import grafp from "../grapf.json"
import {GraphGrid} from "./Graph/Graph"

import {Table} from '../pages/Table/Table';

import { MultiSelect } from 'primereact/multiselect';
import { Butt } from "../components/Button/Butt"
const basicData = grafp

export default function Main() {

   const [modalActive, setModalActive] = useState(false)
   const [node, setNode] = useState(null)
   const [testsStarted, setTestsStarted] = useState(false)
   const [visible, setVisible] = useState(true)
   const [visState, setVisState] = useState(true)
   const [loadedData, setLoadedData] = useState(null)
   const [filteredData, setFilteredData] = useState(basicData)
   const [selectedData, setSelectedData] = useState(null)
   const [selectedClassFilters, setSelectedClassFilters] = useState(null)
   const [selectedEdgesFilters, setSelectedEdgesFilters] = useState(null)

   const classFilters = [
    {name: "PVT", code: "PVT"},
    {name: "Керн", code: "Керн"},
    {name: "ПЕТРОФИЗИКА", code: "ПЕТРОФИЗИКА"},
    {name: "Сейсмика", code: "Сейсмика"},
    {name: "скв.иссл", code: "скв.иссл"},
    ]

    const edgesFilters = [
        {name: "Связь комплексирования ", code: "Однонаправленные"},
        {name: "Связь функциональная", code: "Двунаправленные"}
    ]

   function ModalHelp(){
    setNode(null)
    setModalActive(false)
    setLoadedData(null)
    setTestsStarted(false)
   }

   function Filter(par){
        setSelectedClassFilters(par)
        // подумай, как можно оптимизировать код // нинаю(
        if (filteredData !== basicData){
            if (par.length !==0 ){
                let new_data = {nodes: [], edges: filteredData.edges}
                for (let i = 0; i < par?.length; i++){
                    for (let j = 0; j < grafp.nodes?.length; j++){
                        if (grafp.nodes[j].class == par[i].name){
                            new_data.nodes.push(grafp.nodes[j])
                        }
                    }
                }
                setFilteredData(new_data)
            }
        }
        else{
            if (par.length !== 0){
                let new_data = { nodes: [], edges : grafp.edges}
                for (let i = 0; i < par?.length; i++){
                    for (let j = 0; j< grafp.nodes?.length; j++){
                        if (grafp.nodes[j].class == par[i].name){
                            new_data.nodes.push(grafp.nodes[j])
                        }
                    }
                }
                setFilteredData(new_data)
            }
        }
    }

    function EdgesFilter(par){
        setSelectedEdgesFilters(par)

        if (par.length !==0){
            let new_data = {nodes: filteredData.nodes, edges: []}
            for (let i = 0; i < par?.length; i++){
                for (let j = 0; j < grafp.edges?.length; j++){
                    if ((grafp.edges[j].arrows == "to" && par[i].name == "Связь комлесирования") || (grafp.edges[j].arrows == "to, from" && par[i].name == "Связь функциональная")){
                        new_data.edges.push(grafp.edges[j])
                    }
                }
            }
            setFilteredData(new_data)
        }
    }
    

  return (
    <>
        <Navbar></Navbar>
        <div className='container'>
            <div className='sidebar'>
                <div className='sidebar-content'>
                    <div className='b-cont'>
                        <Butt OnClick={() => setVisState(!visState)} name={visState ? "Граф" : "Таблица"}></Butt>
                    </div>
                    <MultiSelect value={selectedClassFilters} onChange={(e) => Filter(e.value)} options={classFilters} optionLabel="name" placeholder="Типы вершин" maxSelectedLabels={6}  style={{backgroundColor: "#3FBAC2", color: "#FFFFFF"}} className="mb-4"/>
                    <MultiSelect value={selectedEdgesFilters} onChange={(e) => EdgesFilter(e.value)} options={edgesFilters} optionLabel="name" placeholder="Типы связей" maxSelectedLabels={6}  style={{backgroundColor: "#3FBAC2", color: "#FFFFFF"}}/>
                </div>
            </div>
            {visState ?  
                <div className='graph-grid'>
                    <div id="mynetwork" className="networkvis">
                        <GraphGrid callBack={setNode} filteredData={filteredData} selectedData= {setSelectedData}></GraphGrid>
                    </div>
                </div>
                :
                <div className='table-grid' >
                    <Table></Table>
                </div>
            }
        </div>
        <TestWindow active={(node!= null) ? true : false} setActive={setModalActive}>
            {(loadedData == null) ? 
            <>
                <div className='modal-container'>
                    <div className='header-container'>
                        <p className='header'>{node}<i className={visible ? "pi pi-eye pl-4 ic" : "pi pi-eye-slash pl-4 ic"} style={{ fontSize: '1.2rem', color: "#3FBAC2" }} onClick={() => setVisible(!visible)}></i></p>
                    </div>
                    <div className='close-container'>
                        <i className="pi pi-times pr-4 ic" style={{ fontSize: '1.1rem' , color: "#FFFFFF"}} onClick={() => ModalHelp()}></i>
                    </div>
                </div>
                <div className='button-container'>
                    <Butt name='Загрузить данные' OnClick={() => setLoadedData(true)}></Butt>
                </div>
                </>
                :
                <>
                    {(testsStarted == true) ? 
                        <>
                           <div className='modal-container'>
                                <div className='header-container'>
                                    <p className='header'>{node}<i className={visible ? "pi pi-eye pl-4 ic" : "pi pi-eye-slash pl-4 ic"} style={{ fontSize: '1.2rem', color: "#3FBAC2" }} onClick={() => setVisible(!visible)}></i></p>
                                </div>
                                <div className='close-container'>
                                    <i className="pi pi-arrow-left pr-4 ic" style={{ fontSize: '1.1rem' , color: "#FFFFFF"}} onClick={() => setTestsStarted(false)}></i>
                                    <i className="pi pi-times pr-4 ic" style={{ fontSize: '1.1rem' , color: "#FFFFFF"}} onClick={() => ModalHelp()}></i>
                                </div>
                            </div>
                            <div className='data-container'>
                                <p className='data-header'>Данные</p>
                                <p className='data'>LoadedData.txt<i className={"pi pi-trash pl-4 ic"} style={{ fontSize: '1.1rem', color: "#3FBAC2" }}></i></p>
                                <p className='data-header'>Результаты тестирования вершин</p>
                                <p className='data'>Тест номер один самый крутой  <span class="badge-passed">passed</span></p>
                                <p className='data'>Тест номер два <span class="badge-error">error</span></p>
                                <p className='data-header'>Результаты тестирования ребер</p>
                                <p className='data'>Тест номер два <span class="badge-passed">passed</span></p>
                                <p className='data'>Тест номер двтри <span class="badge-not-passed">not passed</span></p>
                                <div className='button-container'>
                                    <Butt name="Скачать полный отчет" OnClick={() => setTestsStarted(true)}></Butt>
                                </div>
                            </div>
                        </>
                        :
                        <>
                        <div className='modal-container'>
                            <div className='header-container'>
                                <p className='header'>{node}<i className={visible ? "pi pi-eye pl-4 ic" : "pi pi-eye-slash pl-4 ic"} style={{ fontSize: '1.2rem', color: "#3FBAC2" }} onClick={() => setVisible(!visible)}></i></p>
                            </div>
                            <div className='close-container'>
                                <i className="pi pi-times pr-4 ic" style={{ fontSize: '1.1rem' , color: "#FFFFFF"}} onClick={() => ModalHelp()}></i>
                            </div>
                        </div>
                        <div className='data-container'>
                            <p className='data-header'>Данные</p>
                            <p className='data'>LoadedData.txt<i className={"pi pi-trash pl-4 ic"} style={{ fontSize: '1.1rem', color: "#3FBAC2" }}></i></p>
                            <p className='data-header'>Тесты для вершин</p>
                            <p className='data'>Тест номер один самый крутой<i className={"pi pi-check pl-4 ic"} style={{ fontSize: '1.1rem', color: "#3FBAC2" }}></i></p>
                            <p className='data'>Тест номер два</p>
                            <p className='data'>Тест номер двтри</p>
                            <p className='data-header'>Тесты для рёбер</p>
                            <p className='data'>Тест номер один самый крутой<i className={"pi pi-check pl-4 ic"} style={{ fontSize: '1.1rem', color: "#3FBAC2" }}></i></p>
                            <p className='data'>Тест номер два</p>
                            <p className='data'>Тест номер двтри</p>
                            <div className='button-container'>
                                <Butt name='Начать тестирование' OnClick={() => setTestsStarted(true)}></Butt>
                            </div>
                            
                        </div>
                        </>
                    }
                </>
            }
        </TestWindow>
    </>
  );
}

