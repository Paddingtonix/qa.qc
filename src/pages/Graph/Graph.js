import React, { useCallback, useState, useEffect } from "react";
import Graph from "react-graph-vis";
import axios from "axios";
import grapf from "../../grapf.json"
import { AutoComplete } from 'primereact/autocomplete';

export const GraphGrid = ({callBack, filteredData, selectedData}) => {
    //default data 
	//вынес в json лучше переписать в use state

	const default_graph = grapf

    let searcher = []

	// console.log(default_graph)
    //push in searcher array
    for (let i = 0; i < default_graph.nodes?.length; i ++){
      	searcher.push(default_graph.nodes[i].label)
    }


    //hooks
    const [searchData] = useState(searcher)
    const [data, setData] = useState(filteredData);
    const [networkNodes, setNetwortNodes] = useState([]);
    const [selectedOption, setSelectedOption] = useState("")
    const [filtered, setFiltered] = useState(null)
	const [mainNetwork, setMainNetwork] = useState(null)
	const [lastSelected, setLastSelected] = useState(null)
	//console.log(callBack)
	//  console.log(filteredData)
    //variables
    const handleAddNode = useCallback(() => {
		const id = data.nodes.length + 1;
		setData({
			...data,
			nodes: [...data.nodes, { id, label: `Node ${id}` }],
		});
    }, [setData, data]);
    

    //callback func
    const getNodes = useCallback((a) => {
      	setNetwortNodes(a);
    }, []);
    
    const handleGetNodes = useCallback(() => {
      	console.log(networkNodes);
    }, [networkNodes]);


    //graph options
    const options = {
		layout: {
			hierarchical: {
				enabled: false,
				// direction: 'UD',        // UD, DU, LR, RL
				// sortMethod: 'hubsize',  // hubsize, directed
				// shakeTowards: 'leaves'  // roots, leaves
			}
		},
		physics: {
			forceAtlas2Based: {
				gravitationalConstant: -1500,
				centralGravity: 0.005,
				springConstant: 0.01,
				springLength: 100,
				damping: 1,
				avoidOverlap: 1
			},
			maxVelocity: 146,
			minVelocity: 0.1,
			solver: "forceAtlas2Based",
			timestep: 0.35,
			stabilization: { 
				iterations: 50, 
				updateInterval: 25
			},
			repulsion: {
				centralGravity: 0.,
				springLength: 200,
				springConstant: 0.05,
				nodeDistance: 100,
				damping: 0.09
			},
		},
		autoResize: true,
		edges: {
			length: 600,
			color: {
				opacity: 0.2
			}
		},
		nodes: {
			shape: "dot",
			size: 50,
			margin: 7,
			color:{
				background: "#F03967",
				highlight: "#3FBAC2",
				border: "#F03967"
			}, 
			opacity: 0.2,
			font: {
				size: 30,
				color: "white"
			}
        }
    };
    

    //event graph
    const events = {
		deselectNode: function (params) {
			params.event = "[original event]"
			// console.log(params)
			Recolor(params.previousSelection.nodes, 'del')
			RecolorEdges(params.previousSelection.edges, 'del')
		},
        click: function (params) {
			console.log(params);
          	params.event = "[original event]";
        },
        doubleClick: function (params) {
          	params.event = "[original event]";
        },
        oncontext: function (params) {
          	params.event = "[original event]";
        },
        dragStart: function (params) {
          	params.event = "[original event]";
        },
        dragging: function (params) {
          	params.event = "[original event]";
        },
        dragEnd: function (params) {
          	params.event = "[original event]";
        },
        controlNodeDragging: function (params) {
          	params.event = "[original event]";
        },
        controlNodeDragEnd: function (params) {
          	params.event = "[original event]";
        },
		selectNode(e) {
			console.log(e);
		},
		selectEdge(e) {
			console.log(e);
		},
        select: function (params) {
        //   console.log(params.nodes, params.edges)
			Recolor(params.nodes, 'sel')
			RecolorEdges(params.edges, 'sel')
            selectedData({nodes: params.nodes, edges: params.edges})
          	callBack(GetNameByID(params.nodes))
        },
    };

	function Recolor(arr, flag){
		for (let i = 0; i < arr?.length; i++){
			// console.log(arr[i])
			if (flag == 'sel'){
				mainNetwork.updateClusteredNode(arr[i], {opacity: 1})
			}
			else {
				mainNetwork.updateClusteredNode(arr[i].id, {opacity : 0.2})
			}
			
			
		}
	}

	function RecolorEdges(arr, flag){
		for (let i = 0; i< arr?.length; i++)
		if (flag == 'sel'){
			mainNetwork.updateEdge(arr[i], {color:{opacity: 1}})
		}
		else{
			mainNetwork.updateEdge(arr[i].id, {color: {opacity: 0.1}})
		}
	}



	function GetNameByID(id){
		for (let i = 0; i < default_graph.nodes?.length; i++){
			if (default_graph.nodes[i].id == id){
				return (default_graph.nodes[i].label)
			}
		}
	}
	

    //graph camera mover
    function CameraMover(e){
        for (let i = 0; i < default_graph.nodes?.length; i++) {
			if (default_graph.nodes[i].label == e) {
				let id = default_graph.nodes[i].id
				mainNetwork.focus(id, {scale: 1.5})
				mainNetwork.selectNodes([id])
			}
		}
	}
	
	CameraMover(selectedOption)
	/*
	var clusterOptions = {
		joinCondition: function (childOptions) {
			return childOptions.class == "Керн";
		}
	}
	mainNetwork.cluster(clusterOptions)*/

    //input search graph peak
    const search = (event) => {
      	setTimeout(() => {
			let _filtered;
			if (!event.query.trim().length) {
				_filtered = [...searchData]
			} else {
				_filtered = searchData.filter((data) => {
					return data.toLowerCase().startsWith(event.query.toLowerCase())
				})
			}
			setFiltered(_filtered)
		}, 250)
    }
	
    return (
		<>
			<span className="search-input">
				<i className="pi pi-search search-input__icon" style={{ color: "white" }}></i>
				<AutoComplete placeholder="Вершина" unstyled={true} value={selectedOption} suggestions={filtered} completeMethod={search} onChange={(e) => setSelectedOption(e.value)}></AutoComplete>
			</span>
			<Graph 
				graph={filteredData}
				options={options}
				events={events}
				getNodes={getNodes}
				getNetwork = {network => {setMainNetwork(network)}}
			/>
		</>
    );
}
  
 