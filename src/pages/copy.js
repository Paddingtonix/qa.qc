import React, { useCallback, useState } from "react";
import Graph from "react-graph-vis";
import { AutoComplete } from 'primereact/autocomplete';

let defaultdata = {
    edges: [
      {from: 0, to: 1, id: "0to1", arrows: "to"},
      {from: 1, to: 96, id: "1to96", arrows: "to"},
      {from: 2, to: 0, id: "2to0", arrows: "to"},
      {from: 3, to: 0, id: "3to0", arrows: "to"},
      {from: 4, to: 0, id: "4to0", arrows: "to"},
      {from: 5, to: 10, id: "5to10", arrows: "to"},
      {from: 6, to: 8, id: "6to8", arrows: "to"},
      {from: 6, to: 10, id: "6to10", arrows: "to"},
      {from: 6, to: 19, id: "6to19", arrows: "to"},
      {from: 6, to: 20, id: "6to20", arrows: "to"},
      {from: 7, to: 0, id: "7to0", arrows: "to"},
      {from: 7, to: 8, id: "7to8", arrows: "to"},
      {from: 8, to: 0, id: "8to0", arrows: "to"},
      {from: 8, to: 10, id: "8to10", arrows: "to"},
      {from: 9, to: 0, id: "9to0", arrows: "to"},
      {from: 9, to: 10, id: "9to10", arrows: "to"},
      {from: 10, to: 11, id: "10to11", arrows: "to"},
      {from: 10, to: 12, id: "10to12", arrows: "to"},
      {from: 10, to: 13, id: "10to13", arrows: "to"},
      {from: 10, to: 14, id: "10to14", arrows: "to"},
      {from: 11, to: 15, id: "11to15", arrows: "to"},
      {from: 12, to: 15, id: "12to15", arrows: "to"},
      {from: 13, to: 13, id: "13to15", arrows: "to"},
      {from: 15, to: 109, id: "15to109", arrows: "to"},
      {from: 16, to: 5, id: "16to5", arrows: "to"},
      {from: 17, to: 5, id: "17to5", arrows: "to"},
      {from: 18, to: 5, id: "18to5", arrows: "to"},
      {from: 19, to: 22, id: "19to22", arrows: "to"},
      {from: 20, to: 22, id: "20to22", arrows: "to"},
      {from: 21, to: 22, id: "21to22", arrows: "to"},
      {from: 23, to: 22, id: "23to22", arrows: "to"},
      {from: 23, to: 33, id: "23to33", arrows: "to"},
      {from: 24, to: 22, id: "24to22", arrows: "to"},
      {from: 24, to: 34, id: "24to34", arrows: "to"},
      {from: 25, to: 22, id: "25to22", arrows: "to"},
      {from: 25, to: 35, id: "25to35", arrows: "to"},
      {from: 26, to: 22, id: "26to22", arrows: "to"},
      {from: 26, to: 36, id: "26to36", arrows: "to"},
      {from: 27, to: 22, id: "27to22", arrows: "to"},
      {from: 28, to: 22, id: "28to22", arrows: "to"},
      {from: 29, to: 22, id: "29to22", arrows: "to"},
      {from: 30, to: 22, id: "30to22", arrows: "to"},
      {from: 31, to: 28, id: "31to28", arrows: "to"},
      {from: 32, to: 28, id: "32to28", arrows: "to"},
      {from: 33, to: 22, id: "33to22", arrows: "to"},
      {from: 34, to: 22, id: "34to22", arrows: "to"},
      {from: 35, to: 22, id: "35to22", arrows: "to"},
      {from: 36, to: 22, id: "36to22", arrows: "to"},
      {from: 37, to: 22, id: "37to22", arrows: "to"},
      {from: 38, to: 22, id: "38to22", arrows: "to"},
      {from: 39, to: 22, id: "39to22", arrows: "to"},
      {from: 39, to: 27, id: "39to27", arrows: "to"},
      {from: 40, to: 22, id: "40to22", arrows: "to"},
      {from: 40, to: 27, id: "40to27", arrows: "to"},
      {from: 40, to: 33, id: "40to33", arrows: "to"},
      {from: 40, to: 34, id: "40to34", arrows: "to"},
      {from: 40, to: 35, id: "40to35", arrows: "to"},
      {from: 40, to: 36, id: "40to36", arrows: "to"},
      {from: 40, to: 37, id: "40to37", arrows: "to"},
      {from: 41, to: 22, id: "41to22", arrows: "to"},
      {from: 41, to: 27, id: "41to27", arrows: "to"},
      {from: 41, to: 33, id: "41to33", arrows: "to"},
      {from: 41, to: 34, id: "41to34", arrows: "to"},
      {from: 41, to: 35, id: "41to35", arrows: "to"},
      {from: 41, to: 36, id: "41to36", arrows: "to"},
      {from: 41, to: 37, id: "41to37", arrows: "to"},
      {from: 42, to: 43, id: "42to43", arrows: "to"},
      {from: 42, to: 44, id: "42to44", arrows: "to"},
      {from: 42, to: 45, id: "42to45", arrows: "to"},
      {from: 42, to: 46, id: "42to46", arrows: "to"},
      {from: 42, to: 47, id: "42to47", arrows: "to"},
      {from: 42, to: 48, id: "42to48", arrows: "to"},
      {from: 42, to: 49, id: "42to49", arrows: "to"},
      {from: 42, to: 50, id: "42to50", arrows: "to"},
      {from: 42, to: 51, id: "42to51", arrows: "to"},
      {from: 42, to: 52, id: "42to52", arrows: "to"},
      {from: 42, to: 53, id: "42to53", arrows: "to"},
      {from: 42, to: 54, id: "42to54", arrows: "to"},
      {from: 55, to: 44, id: "55to44", arrows: "to"},
      {from: 55, to: 47, id: "55to47", arrows: "to"},
      {from: 55, to: 50, id: "55to50", arrows: "to"},
      {from: 55, to: 52, id: "55to52", arrows: "to"},
      {from: 56, to: 43, id: "56to43", arrows: "to"},
      {from: 56, to: 46, id: "56to46", arrows: "to"},
      {from: 56, to: 49, id: "56to49", arrows: "to"},
      {from: 56, to: 51, id: "56to51", arrows: "to"},
      {from: 56, to: 54, id: "56to54", arrows: "to"},
      {from: 57, to: 45, id: "57to45", arrows: "to"},
      {from: 57, to: 48, id: "57to48", arrows: "to"},
      {from: 57, to: 53, id: "57to53", arrows: "to"},
      {from: 59, to: 58, id: "59to58", arrows: "to"},
      {from: 60, to: 100, id: "60to100", arrows: "to"},
      {from: 61, to: 60, id: "61to60", arrows: "to"},
      {from: 61, to: 79, id: "61to79", arrows: "to"},
      {from: 63, to: 62, id: "63to62", arrows: "to"},
      {from: 65, to: 64, id: "65to64", arrows: "to"},
      {from: 66, to: 65, id: "66to65", arrows: "to"},
      {from: 66, to: 70, id: "66to70", arrows: "to"},
      {from: 66, to: 97, id: "66to97", arrows: "to"},
      {from: 66, to: 102, id: "66to102", arrows: "to"},
      {from: 67, to: 70, id: "67to70", arrows: "to"},
      {from: 68, to: 70, id: "68to70", arrows: "to"},
      {from: 69, to: 68, id: "69to68", arrows: "to"},
      {from: 70, to: 95, id: "70to95", arrows: "to"},
      {from: 71, to: 0, id: "71to0", arrows: "to"},
      {from: 71, to: 88, id: "71to88", arrows: "to"},
      {from: 71, to: 96, id: "71to96", arrows: "to"},
      {from: 72, to: 97, id: "72to97", arrows: "to"},
      {from: 72, to: 99, id: "72to99", arrows: "to"},
      {from: 75, to: 73, id: "75to73", arrows: "to"},
      {from: 75, to: 95, id: "75to95", arrows: "to"},
      {from: 75, to: 104, id: "75to104", arrows: "to"},
      {from: 76, to: 99, id: "76to99", arrows: "to"},
      {from: 77, to: 59, id: "77to59", arrows: "to"},
      {from: 77, to: 98, id: "77to98", arrows: "to"},
      {from: 79, to: 73, id: "79to73", arrows: "to"},
      {from: 79, to: 104, id: "79to104", arrows: "to"},
      {from: 80, to: 61, id: "80to61", arrows: "to"},
      {from: 80, to: 63, id: "80to63", arrows: "to"},
      {from: 80, to: 65, id: "80to65", arrows: "to"},
      {from: 80, to: 95, id: "80to95", arrows: "to"},
      {from: 80, to: 105, id: "80to105", arrows: "to"},
      {from: 81, to: 104, id: "81to104", arrows: "to"},
      {from: 82, to: 65, id: "82to65", arrows: "to"},
      {from: 82, to: 70, id: "82to70", arrows: "to"},
      {from: 82, to: 102, id: "82to102", arrows: "to"},
      {from: 82, to: 107, id: "82to107", arrows: "to"},
      {from: 82, to: 110, id: "82to110", arrows: "to"},
      {from: 83, to: 104, id: "83to104", arrows: "to"},
      {from: 84, to: 101, id: "84to101", arrows: "to"},
      {from: 85, to: 102, id: "85to102", arrows: "to"},
      {from: 86, to: 61, id: "86to61", arrows: "to"},
      {from: 86, to: 63, id: "86to63", arrows: "to"},
      {from: 86, to: 65, id: "86to65", arrows: "to"},
      {from: 86, to: 95, id: "86to95", arrows: "to"}, 
      {from: 86, to: 105, id: "86to105", arrows: "to"},
      {from: 88, to: 103, id: "88to103", arrows: "to"},
      {from: 88, to: 19, id: "88to19", arrows: "to"},
      {from: 90, to: 61, id: "90to61", arrows: "to"},
      {from: 90, to: 63, id: "90to63", arrows: "to"},
      {from: 90, to: 65, id: "90to65", arrows: "to"},
      {from: 90, to: 102, id: "90to102", arrows: "to"},
      {from: 91, to: 108, id: "91to108", arrows: "to"},
      {from: 92, to: 105, id: "92to105", arrows: "to"}, 
      {from: 93, to: 105, id: "93to105", arrows: "to"},
      {from: 94, to: 61, id: "94to61", arrows: "to"},
      {from: 94, to: 63, id: "94to63", arrows: "to"},
      {from: 94, to: 95, id: "94to95", arrows: "to"},
      {from: 94, to: 96, id: "94to96", arrows: "to"}, 
      {from: 94, to: 101, id: "94to101", arrows: "to"},
      {from: 94, to: 103, id: "94to103", arrows: "to"},
      {from: 94, to: 104, id: "94to104", arrows: "to"},
      {from: 95, to: 73, id: "95to73", arrows: "to"},
      {from: 96, to: 80, id: "96to80", arrows: "to"},
      {from: 97, to: 71, id: "97to71", arrows: "to"},
      {from: 98, to: 74, id: "98to74", arrows: "to"},
      {from: 99, to: 71, id: "99to71", arrows: "to"},
      {from: 100, to: 78, id: "100to78", arrows: "to"},
      {from: 101, to: 77, id: "101to77", arrows: "to"},
      {from: 102, to: 84, id: "102to84", arrows: "to"},
      {from: 103, to: 86, id: "103to86", arrows: "to"},
      {from: 104, to: 89, id: "104to89", arrows: "to"},
      {from: 105, to: 87, id: "105to87", arrows: "to"},
      {from: 106, to: 88, id: "106to88", arrows: "to"},
      {from: 107, to: 92, id: "107to92", arrows: "to"},
      {from: 108, to: 94, id: "108to94", arrows: "to"},
      {from: 109, to: 94, id: "109to94", arrows: "to"},
      {from: 110, to: 93, id: "110to93", arrows: "to"}
    ],
    nodes: [
      {id: 0, label: "Построение трендов ФЕС (карты)", color: "#F03967", hidden : true, x: null, y: null},
      {id: 1, label: "Карты трендов | ASCII", hidden : true},
      {id: 2, label: "Атрибут №4",hidden : true, x: null, y: null},
      {id: 3, label: "Атрибут №5",hidden : true},
      {id: 4, label: "Атрибут №6", hidden : true},
      {id: 5, label: "Полигоны/плоскости разломов TWT | Charisma Fault Sticks", hidden : true},
      {id: 6, label: "Checkshots (Отбивки пластопересечений во времени и глубине) | txt/xlsx", hidden : true},
      {id: 7, label: "Временной (TWT) куб NP cropped | SEG-Y", hidden : true},
      {id: 8, label: "Кровля пласта TWT | Irap/CPS3", hidden : true},
      {id: 9, label: "Подошва пласта TWT | Irap/CPS3", hidden : true},
      {id: 10, label: "Скоростной закон", hidden : true},
      {id: 11, label: "Полигоны/плоскости разломов TVDSS | Charisma Fault Sticks", hidden : true},
      {id: 12, label: "Структурная поверхность кровли TVDSS | SEG-Y", hidden : true},
      {id: 13, label: "Структурная поверхность подошвы TVDSS | SEG-Y", hidden : true},
      {id: 14, label: "Глубинный (TVDSS) куб NP cropped | SEG-Y", hidden : true},
      {id: 15, label: "Структурный каркас TVDSS (Faults) | Charisma Fault Sticks", hidden : true},
      {id: 16, label: "Атрибут №1", hidden : true},
      {id: 17, label: "Атрибут №2", hidden : true},
      {id: 18, label: "Атрибут №3", hidden : true},
      {id: 19, label: "Перфорации скважин | txt/xlsx", hidden : true},
      {id: 20, label: "Отчет по ПГИ | txt/xlsx", hidden : true},
      {id: 21, label: "Отчеты по ГТИ | txt/xlsx", hidden : true},
      {id: 22, label: "История разработки | txt/xlsx", hidden : true},
      {id: 23, label: "OPR | txt/xlsx", hidden : true},
      {id: 24, label: "WPR | txt/xlsx", hidden : true},
      {id: 25, label: "GPR | txt/xlsx", hidden : true},
      {id: 26, label: "LPR | txt/xlsx", hidden : true},
      {id: 27, label: "WIRT | txt/xlsx", hidden : true},
      {id: 28, label: "Результаты интерпретации ГДИС | txt/xlsx", hidden : true},
      {id: 29, label: "Глубины подвеса насоса (для Рзаб) | txt/xlsx", hidden : true},
      {id: 30, label: "BHP | txt/xlsx", hidden : true},
      {id: 31, label: "Результаты КВД-тестов | txt/xlsx", hidden : true},
      {id: 32, label: "Результаты КПД-тестов | txt/xlsx", hidden : true},
      {id: 33, label: "OPRT | txt/xlsx", hidden : true},
      {id: 34, label: "WPRT | txt/xlsx", hidden : true},
      {id: 35, label: "GPRT | txt/xlsx", hidden : true},
      {id: 36, label: "LPRT | txt/xlsx", hidden : true},
      {id: 37, label: "GIRT | txt/xlsx"},
      {id: 38, label: "GIR | txt/xlsx"},
      {id: 39, label: "WIR | txt/xlsx"},
      {id: 40, label: "WEFAC | txt/xlsx"},
      {id: 41, label: "DATE | txt/xlsx"},
      {id: 42, label: "PVT исследования | txt/xlsx"},
      {id: 43, label: "Visc oil | txt/xlsx"},
      {id: 44, label: "Visc Water | txt/xlsx"},
      {id: 45, label: "Visc Gas | txt/xlsx"},
      {id: 46, label: "Bo | txt/xlsx"},
      {id: 47, label: "Bw | txt/xlsx"},
      {id: 48, label: "Z-factor | txt/xlsx"},
      {id: 49, label: "Compressibility Oil | txt/xlsx"},
      {id: 50, label: "Compressibility Water | txt/xlsx"},
      {id: 51, label: "Oil Dens | txt/xlsx"},
      {id: 52, label: "Water Dens | txt/xlsx"},
      {id: 53, label: "Gas Dens | txt/xlsx"},
      {id: 54, label: "Bubble point Pressure | txt/xlsx"},
      {id: 55, label: "Water Salinity | txt/xlsx"},
      {id: 56, label: "Oil composition | txt/xlsx"},
      {id: 57, label: "Gas composition | txt/xlsx"},
      {id: 58, label: "SGCR GRDECL"},
      {id: 59, label: "Мульт (Псевдо-двухфазный аспскейлинг)"},
      {id: 60, label: "SGL | GRDECL"},
      {id: 61, label: "Зависимость Sgl vs. Poro илиSogcr vs. Perm"},
      {id: 62, label: "SOGCR | GRDECL"},
      {id: 63, label: "Зависимость Sogcr vs. Poro или Sogcr vs. Perm"},
      {id: 64, label: "SOWCR | GRDECL"},
      {id: 65, label: "Зависимость Sowcr vs. Poro или Sowcr vs. Perm"},
      {id: 66, label: "Porosity по керну | txt/xlsx"},
      {id: 67, label: "Капиллярометрия | txt/xlsx ПЕТРОФИЗИКА"},
      {id: 68, label: "PVT-свойства флюидов | txt/xlsx"},
      {id: 69, label: "Отчеты о PVT исследованиях"},
      {id: 70, label: "J-function | txt/xlsx"},
      {id: 71, label: "Porosity | las"},
      {id: 72, label: "Density | las"},
      {id: 73, label: "SWATINIT | GRDECL"},
      {id: 74, label: "SGU | GRDECL"},
      {id: 75, label: "ВНК | ASCII GRID"},
      {id: 76, label: "Neutron | las"},
      {id: 77, label: "SWL | GRDECL"},
      {id: 78, label: "SWCR | GRDECL"},
      {id: 79, label: "ГНК | ASCII GRID"},
      {id: 80, label: "Porosity | GRDECL"},
      {id: 81, label: "Sgl по керну | txt/xlsx"},
      {id: 82, label: "PermX по керну | txt/xlsx"},
      {id: 83, label: "Sowcr по керну | txt/xlsx"},
      {id: 84, label: "Swl | las"},
      {id: 85, label: "Кво по керну | txt/xlsx"},
      {id: 86, label: "PermX | GRDECL"},
      {id: 87, label: "ACTNUM | GRDECL"},
      {id: 88, label: "PermX | las"},
      {id: 89, label: "SWU | GRDECL"},
      {id: 90, label: "ОФП | txt/xlsx"},
      {id: 91, label: "Граница области моделирования | txt/xlsx"},
      {id: 92, label: "PermY | GRDECL"},
      {id: 93, label: "PermZ | GRDECL"},
      {id: 94, label: "GRID модели | GRDECL"},
      {id: 95, label: "Зависимость | J vs Sw"},
      {id: 96, label: "Вариограмма пористости"},
      {id: 97, label: "Зависимость | Poro Core vs Log"},
      {id: 98, label: "1 - Swl"},
      {id: 99, label: "ZONE # (поправка пористости)"},
      {id: 100, label: "Мульт (Псевдо-двухфазный аспскейлинг)"},
      {id: 101, label: "Вариограмма Perm или Poro"},
      {id: 102, label: "Зависимость Кво vs. Perm или"},
      {id: 103, label: "Вариограмма проницаемости"},
      {id: 104, label: "Зависимость Sat vs. Contact"},
      {id: 105, label: "ZONE # (diff cutoffs)"},
      {id: 106, label: "Зависимость Perm Core vs Log"},
      {id: 107, label: "Анизотропия PermX / PermY"},
      {id: 108, label: "PillarGriding"},
      {id: 109, label: "Layering"},
      {id: 110, label: "Анизотропия PermX / PermZ"}
  
    ]
  }
  
  
  export const Graphik = ({callBack}) => {
    let searcher = []

    for (let i = 0; i < defaultdata.nodes?.length; i ++){
      searcher.push(defaultdata.nodes[i].label)
    }

    const [searchData, setSearchData] = useState(searcher)
    const [selectedOption, setSelectedOption] = useState(null)
    const [filtered, setFiltered] = useState(null)
 
    const search = (event) => {
     setTimeout(() => {
         let _filtered;
         if (!event.query.trim().length) {
             _filtered = [...searchData]
         }
         else {
             _filtered = searchData.filter((data) => {
                 return data.toLowerCase().startsWith(event.query.toLowerCase())
             })
         }
         setFiltered(_filtered)
     }, 250)
    }

    let events = {
        click: function (params) {
          params.event = "[original event]";
          console.log(
            "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
          );
          console.log(defaultdata.nodes[2])
        },
        doubleClick: function (params) {
          console.log("doubleClick Event:", params);
          params.event = "[original event]";
        },
        oncontext: function (params) {
          console.log("oncontext Event:", params);
      
          params.event = "[original event]";
        },
        dragStart: function (params) {
          // There's no point in displaying this event on screen, it gets immediately overwritten
          params.event = "[original event]";
          console.log("dragStart Event:", params);
          console.log(
            "dragStart event, getNodeAt returns: " +
              this.getNodeAt(params.pointer.DOM)
          );
        },
        dragging: function (params) {
          params.event = "[original event]";
        },
        dragEnd: function (params) {
          params.event = "[original event]";
          console.log("dragEnd Event:", params);
          console.log(
            "dragEnd event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
          );
        },
        controlNodeDragging: function (params) {
          params.event = "[original event]";
        },
        controlNodeDragEnd: function (params) {
          params.event = "[original event]";
          console.log("controlNodeDragEnd Event:", params);
        },
        zoom: function (params) {},
        showPopup: function (params) {},
        hidePopup: function () {
          console.log("hidePopup Event");
        },
        select: function (params) {
          console.log("select Event:", params);
          setSelectedNode(params.nodes)
          callBack(selectedNode)
          console.log(defaultdata.nodes[2])
        },
        selectNode: function (params) {
          console.log("selectNode Event:", params);
        },
        selectEdge: function (params) {
          console.log("selectEdge Event:", params);
        },
        deselectNode: function (params) {
          console.log("deselectNode Event:", params);
        },
        deselectEdge: function (params) {
          console.log("deselectEdge Event:", params);
        },
        hoverNode: function (params) {
          console.log("hoverNode Event:", params);
        },
        hoverEdge: function (params) {
          console.log("hoverEdge Event:", params);
        },
        blurNode: function (params) {
          console.log("blurNode Event:", params);
        },
        blurEdge: function (params) {
          console.log("blurEdge Event:", params);
        },
      };
    const [data, setData] = useState(defaultdata);
    const [networkNodes, setNetwortNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState('')
  
    const handleAddNode = useCallback(() => {
      const id = data.nodes.length + 1;
      setData({
        ...data,
        nodes: [...data.nodes, { id, label: `Node ${id}` }],
      });
    }, [setData, data]);
  
    const getNodes = useCallback((a) => {
      setNetwortNodes(a);
    }, []);
  
    const handleGetNodes = useCallback(() => {
      console.log(networkNodes);
    }, [networkNodes]);

    
   function CameraMover(e){
    for (let i = 0; i < defaultdata.nodes?.length; i++){
      if (defaultdata.nodes[i].label == e){
        let id = defaultdata.nodes[i].id
        if (defaultdata.nodes[i].hidden == true){
          defaultdata.nodes[i].hidden = false
        }
        else {
          defaultdata.nodes[i].hidden = true
        }
      }
    }
   }
    return (
      <>
      <div className=' mt-3 pl-3' style={{ backgroundColor: "#1E1E1E"}}>
      <span className="p-autocomplete-input-icon-left">
          <i className="pi pi-search" style={{color: "white"}}></i>
          <AutoComplete placeholder="Вершина" value={selectedOption} suggestions={filtered}  completeMethod={search} onChange={(e) => CameraMover(e.value)}></AutoComplete>
      </span>
          
      </div>
        <Graph
          data={data}
          options={{
            edges: {
                length: 100
              },
              nodes: {
                shape: "box",
                widthConstraint: 100,
                heightConstraint: 50,
                margin: 7,
                color: "#F03967",
                font: {
                  color: "white"
                }
                
              },
              "physics": {
                "barnesHut": {
                  "theta": 0.1,
                  "gravitationalConstant": -5800,
                  "centralGravity": 0,
                  "springLength": 175,
                  "springConstant": 0.005,
                  "damping": 0.14
                },
                "maxVelocity": 46,
                "minVelocity": 0.75
              }
          }}
          events={events}
          getNodes={getNodes}
        />
        </>
    );
  }
  
 