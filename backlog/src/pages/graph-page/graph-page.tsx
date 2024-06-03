import { SetStateAction, useCallback, useState, useEffect } from "react";
import Graph from "react-graph-vis";
const graph = require("../../graph.json")

type Node = {
    id: number,
    label: string,
    type: string,
    class: string,
    group: string,
	data: string
}
type Edge = {
    from: number,
    to: number,
    id: null,
    arrows: string,
    tests: string[]
}
type graphData = { nodes: Node[], edges: Edge[] }

interface Props {
	filteredData: graphData | any,
	selectedData: graphData | any,
	setName: Function | any,
	callBack: Function | any,
	modalState: Function | any,
	selectNode: Function | any,
	defaultData: any
}



export const GraphPage = ({ callBack, filteredData, setName, modalState, selectNode, defaultData }: Props, ) => {	
    let searcher: SetStateAction<string[]> = []
	let graph_data = graph

	console.log(defaultData);

	
    for (let i = 0; i < defaultData.nodes?.length; i ++){
      	searcher.push(defaultData.nodes[i].label)
    }

    //hooks
    const [originalData, setOriginalData] = useState(searcher);
	const [searchData, setSearchData] = useState(originalData);


    const [data, setData] = useState(filteredData);
    const [networkNodes, setNetwortNodes] = useState([]);
    const [selectedOption, setSelectedOption] = useState("")
    const [filtered, setFiltered] = useState<graphData[] | any>([])
	const [mainNetwork, setMainNetwork] = useState<any>(null)
	const [lastSelected, setLastSelected] = useState(null)
	const [visibleList, setVisibleList] = useState(false)

	const [physicsEnabled, setPhysicsEnabled] = useState(true);

    //callback func
    const getNodes = useCallback((a: any) => { //пофиксить тип
      	setNetwortNodes(a);
		
    }, []);

	// for(let i = 0; i < graph_data.nodes.length; i++) {
	// 	if(graph_data.nodes[i].data === "success") {
	// 		Recolor([graph_data.nodes[i].id], 'sel')
	// 		// RecolorEdges([graph_data.edges.forEach((edge: { from: any; }) => edge.from === graph_data.nodes[i].id)], 'sel')
	// 		// mainNetwork.updateClusteredNode(graph_data.edges[i], {opacity: 1})
	// 	}
	// }
    
    const handleGetNodes = useCallback(() => {
      	console.log(networkNodes);
    }, [networkNodes]);

	useEffect(() => {
		if(physicsEnabled) {			
			
			const timeoutId = setTimeout(() => {
				
				setPhysicsEnabled(false);				
			}, 2000)

			return () => clearTimeout(timeoutId);
		}
	}, [physicsEnabled])

	useEffect(() => {
		setPhysicsEnabled(true);		
	}, [filteredData])

    //graph options
    const options = {
		layout: {
			hierarchical: {
				enabled: false,
			}
		},
		physics: {
			enabled: physicsEnabled,
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
			barnesHut: {
				gravitationalConstant: 10,
				springLength: 200
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
        },
    };
	
	function GetNameByID(id: number){
		for (let i = 0; i < defaultData.nodes?.length; i++){
			if (defaultData.nodes[i].id == id){
				return (defaultData.nodes[i].label)
			}
		}
	}

    //event graph
    const events = {
		deselectNode: function (params: { event: string; previousSelection: { nodes: any; edges: any; }; }) {
			params.event = "[original event]"			
			Recolor(params.previousSelection.nodes, 'del')
			RecolorEdges(params.previousSelection.edges, 'del')

			modalState(false)

			selectNode('original')
			
		},
        selectNode: function (params: { nodes: any; edges: any; }) {
			Recolor(params.nodes, 'sel')
			console.log(params.nodes);
			
			RecolorEdges(params.edges, 'sel')
			setName(GetNameByID(params.nodes))
			modalState(true)

			mainNetwork.focus(params.nodes[0], {scale: 0.2})
			
			selectNode(params.nodes[0])
        },
		init: (e: any) => {
		}
    };

	function Recolor(arr: string | any[], flag: string){
		console.log(arr);
		
		for (let i = 0; i < arr?.length; i++){
			if (flag == 'sel'){
				
				mainNetwork.updateClusteredNode(arr[i], {opacity: 1})
			}
			else {
				mainNetwork.updateClusteredNode(arr[i].id, {opacity : 0.2})
			}
		}
	}

	function RecolorEdges(arr: string | any[], flag: string){
		for (let i = 0; i< arr?.length; i++)
		if (flag == 'sel'){
			mainNetwork.updateEdge(arr[i], {color:{opacity: 1}})
		}
		else{
			mainNetwork.updateEdge(arr[i].id, {color: {opacity: 0.1}})
		}
	}


	

    //graph camera mover
    function CameraMover(e: string){		
        for (let i = 0; i < defaultData.nodes?.length; i++) {
			if (defaultData.nodes[i].label.split('|')[0] === e) {				
				let id = defaultData.nodes[i].id


				
				mainNetwork.focus(id, {scale: 1.5})
				mainNetwork.selectNodes([id])
			}
		}
	}

	function openList(state_list: boolean) {
		setVisibleList(state_list)
	}

	function setSearchValue(value: string) {	
		setSelectedOption(value)
		
		search(value)
		openList(false)
	}
	
	// CameraMover(selectedOption)

    // input search graph peak
	const searchFromClick = (e: React.KeyboardEvent<HTMLInputElement>, value: string) => {
		if(e.key === 'Enter') {
			search(value)
			openList(false)
		}
	}

	const search = (str: string) => {
		let filteredResults = originalData.filter(label => label.toLowerCase().startsWith(str.toLowerCase()));
		
		setSelectedOption(str)
		setSearchData(filteredResults);

		CameraMover(selectedOption);
	};
	  
	const setInputValue = (e: any) => {
		const inputValue = e.target.value;
		setSelectedOption(inputValue);
	  
		if (e.nativeEvent.inputType === 'deleteContentBackward' && inputValue) {
		  setSearchData(originalData);
		  search(inputValue);
		} else {
		  search(inputValue);
		}
	};

	
	return (
		<>
			<div className="search-input">
				<svg onClick={() => {search(selectedOption)}} className="pi pi-search search-input__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M18.677 19.607L12.962 13.891C10.4196 15.6985 6.91642 15.2564 4.90285 12.8739C2.88929 10.4915 3.03714 6.96361 5.24298 4.75802C7.44824 2.55147 10.9765 2.40298 13.3594 4.41644C15.7422 6.42989 16.1846 9.93347 14.377 12.476L20.092 18.192L18.678 19.606L18.677 19.607ZM9.48498 5.00001C7.58868 4.99958 5.95267 6.3307 5.56745 8.18745C5.18224 10.0442 6.15369 11.9163 7.89366 12.6703C9.63362 13.4242 11.6639 12.8528 12.7552 11.3021C13.8466 9.75129 13.699 7.64734 12.402 6.26402L13.007 6.86402L12.325 6.18402L12.313 6.17202C11.5648 5.4192 10.5464 4.99715 9.48498 5.00001Z" fill="#ffffff"/>
				</svg>
				<div className="search-input__field">
					<input 
						type="text" 
						placeholder="Вершина"
						value={selectedOption}
						onFocus={() => openList(true)}
						onKeyDown={(e) => searchFromClick(e, selectedOption)}
						onChange={(e: any) => setInputValue(e)}
					/>
				</div>
				{visibleList && searchData.length > 0 &&
					<div className='search-input__list'>
						{searchData.slice(0, 3).map((name: string) => (
							<span key={name} onClick={() => setSearchValue(name.split('|')[0])}>{name.split('|')[0]}</span>
						))}
					</div>
				}
			</div>
			<Graph 
				graph={filteredData}
				options={options}
				events={events}
				getNodes={getNodes}
				getNetwork={network => setMainNetwork(network)}
			/>
		</>
	);	  
}
  

