import { useState, useEffect } from 'react';
import axios from 'axios';
import { Node, Edge, GraphTable, FilterType } from '../types/types';

//pages
import { GraphPage } from './graph-page/graph-page';
import { TablePage } from './table-page/table-page';

//components
import { NavbarCmp } from '../components/navbar-cmp/navbar-cmp';
import {SidebarCmp} from "../components/sidebar-cmp/sidebar-cmp";
import { response } from 'express';

export default function Main() {
    const [defaultGraph, setDefaultGraph] = useState({
        nodes: [] as Array<Node>,
        edges: [] as Array<Edge>
    });
    const [actualGraphData, setActualGraphData] = useState(() => defaultGraph);
    const [displayOption, setDisplayOption] = useState<boolean>(true);
    const [graphTable, setGraphTable] = useState<GraphTable>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalOptionName, setModalOptionName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [preloaderState, setPreloaderState] = useState<boolean>(true)
    const [filterParams, setFilterParams] = useState({
        type:'' as string,
        value: '' as string
    })
    const [updateData, setUpdateData] = useState<boolean>(false)
    
    //login data
    const [jwtToken, setJwtToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("")

    const [urls] = useState([
        '/api/graph.json',
        '/api/output.json'
    ]);

    const [endpoints] = useState({
        imitation: [
            '/api/graph.json',
            '/api/output.json'
        ],
        server: [
            '/graph_structure',
            '/argument_structure',
            '/table_structure'
        ] 
    });

    //hooks
    useEffect(() => {
        // axios.all(
        //     urls.map((endpoint: string) => {
        //         return axios.get(endpoint);
        //     })
        // )
        // .then(axios.spread((responseGraph, responseOutput) => {
        //     setDefaultGraph(responseGraph.data);
        //     setGraphTable(responseOutput.data);
        // }))
        // .catch(error => {
        //     console.error('Ошибка при выполнении запросов:', error);
        // });

        axios
            .post('https://qa-qc-api.freydin.space/user/login', {
                email: "admin@example.com",
                password: 'admin'
            })
            .then((response_login: any) => {
                setJwtToken(response_login.data.access_token)
                setRefreshToken(response_login.data.refresh_token)
            })
            .finally(() => {
                console.log(jwtToken);
            })
    }, []);

    useEffect(() => {
        if(jwtToken) {
            loadData()
        }
    }, [jwtToken])

    useEffect(() => {
        if(jwtToken) {
            loadData()
        }
    }, [updateData])

    useEffect(() => {
        setActualGraphData(defaultGraph)
        setLoading(false);   
        if(defaultGraph.nodes.length && defaultGraph.edges.length) {
            setPreloaderState(false)  
        }        
    }, [defaultGraph])

    useEffect(() => {        
        let filteredData = {...defaultGraph }

        switch (filterParams.type) {
            case 'type_nodes':                
                filteredData.nodes = defaultGraph.nodes.filter(node => node.class === filterParams.value);

                setActualGraphData(filteredData);
            
                break;
            case 'type_edges': 
                filteredData.edges = defaultGraph.edges.filter(edge => filterParams.value === 'Односторонняя' ? edge.arrows === 'to' : edge.arrows === 'to, from');
                filteredData.nodes = defaultGraph.nodes.filter(node => filteredData.edges.some(edge => edge.to === node.id || edge.from === node.id));
                
                setActualGraphData(filteredData);

                break;
            
                case 'type_attributes': 
                    if(filterParams.value === 'По формату') {
                        filteredData.nodes = defaultGraph.nodes.map(node => ({
                            ...node,
                            group: node.type,
                            type: node.group
                        }));
                                        
                        setActualGraphData(filteredData);
                    } else {
                        filteredData.nodes = defaultGraph.nodes.map(node => ({
                            ...node,
                            group: node.class,
                            type: node.group
                        }));

                        setActualGraphData(filteredData);
                    }

                break;
            default:
                setActualGraphData({...defaultGraph });
                
                break;
        }
    }, [filterParams])
    
    //func 
    const changeState = (state: boolean | ((prevState: boolean) => boolean)) => {
        setDisplayOption(state)
    }
    
    const selectNode = (id: number | string) => {
        let selectNodeData = { ...defaultGraph };
    
        if (id === 'original') {
            setActualGraphData(selectNodeData);
            return; 
        }
    
        const filteredNodes = selectNodeData.edges.reduce((filteredNodes: any[], edge: any) => {
            if (edge.from === id) {
                const matchingNode = selectNodeData.nodes.find((node: any) => node.id === edge.to);
                filteredNodes.push(matchingNode);
                filteredNodes.push(selectNodeData.nodes.find((node: any) => node.id === edge.from));
            }
            return filteredNodes;
        }, []);
    
        selectNodeData.nodes = filteredNodes;
    
        setActualGraphData(selectNodeData);
    };
    
    const loadData = () => {
        axios.defaults.baseURL = "https://qa-qc-api.freydin.space/api/v1"
            axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`

            axios.all(
                endpoints.server.map((endpoint: string) => {
                    return axios.get(endpoint);
                })
            )
            .then(axios.spread((response_graph_structure, response_argument_structure, response_table_structure) => {
                console.log(response_graph_structure, response_argument_structure, response_table_structure);
                setGraphTable(response_table_structure.data)
                setDefaultGraph(response_graph_structure.data)
            }))
            .catch(error => {
                console.error('Ошибка при выполнении запросов:', error);
            });  
    }

    const openModalState = (state: boolean) => {
        setOpenModal(state);
    }

    const setNameNodes = (name: string) => {
        setModalOptionName(name);
    }
    
    console.log(defaultGraph)
    return (
        <>
        {preloaderState ? 
            <div className='qa-qc__preloader'>
                <svg className='qa-qc__preloader__logo' width="202" height="66" viewBox="0 0 202 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.1407 55.4405C19.0135 55.4405 16.096 54.8582 13.3883 53.6927C10.7187 52.5273 8.39232 50.8874 6.40923 48.7726C4.46422 46.6578 2.93874 44.176 1.83277 41.3272C0.764936 38.4788 0.231018 35.3712 0.231018 32.0049C0.231018 28.6385 0.764936 25.5309 1.83277 22.6823C2.93874 19.8338 4.48328 17.3521 6.46641 15.2372C8.44953 13.1224 10.7759 11.4823 13.4455 10.317C16.1151 9.15167 19.0135 8.56903 22.1407 8.56903C25.3061 8.56903 28.2045 9.15167 30.8358 10.317C33.5056 11.4823 35.8127 13.1224 37.7579 15.2372C39.741 17.3089 41.2854 19.769 42.3916 22.6176C43.4975 25.4661 44.0505 28.5951 44.0505 32.0049C44.0505 35.3712 43.4975 38.5005 42.3916 41.392C41.2854 44.2408 39.741 46.7222 37.7579 48.8374C35.8127 50.9087 33.5056 52.5273 30.8358 53.6927C28.2045 54.8582 25.3061 55.4405 22.1407 55.4405ZM35.2409 65.0868C33.677 65.0868 32.1899 64.8928 30.7789 64.5044C29.4058 64.1157 28.0329 63.4899 26.66 62.6267C25.3252 61.7635 23.9141 60.5984 22.4268 59.1308C20.9775 57.6635 19.3949 55.8506 17.6787 53.6927L27.4036 50.9087C28.4333 52.506 29.3868 53.7789 30.264 54.7286C31.1409 55.6779 31.9801 56.3472 32.7809 56.7355C33.6201 57.1239 34.497 57.3182 35.4123 57.3182C37.8532 57.3182 40.0269 56.1959 41.934 53.9515L46.0525 59.5192C43.345 63.2312 39.741 65.0868 35.2409 65.0868ZM22.1407 46.5065C23.9331 46.5065 25.573 46.1612 27.0604 45.4707C28.5859 44.7801 29.9207 43.7877 31.0648 42.4927C32.2088 41.198 33.086 39.6656 33.6962 37.8961C34.3445 36.0835 34.6688 34.1197 34.6688 32.0049C34.6688 29.8467 34.3445 27.8831 33.6962 26.1135C33.086 24.344 32.2088 22.8118 31.0648 21.517C29.9207 20.2222 28.5859 19.2295 27.0604 18.5389C25.573 17.8484 23.9331 17.5031 22.1407 17.5031C20.3483 17.5031 18.6893 17.8484 17.1639 18.5389C15.6383 19.2295 14.3036 20.2222 13.1595 21.517C12.0535 22.8118 11.1763 24.344 10.528 26.1135C9.91783 27.8831 9.61273 29.8467 9.61273 32.0049C9.61273 34.1197 9.91783 36.0835 10.528 37.8961C11.1763 39.6656 12.0535 41.198 13.1595 42.4927C14.3036 43.7877 15.6383 44.7801 17.1639 45.4707C18.6893 46.1612 20.3483 46.5065 22.1407 46.5065ZM45.1935 54.6638L63.0416 9.34588H72.1947L90.1 54.6638H80.3751L65.7303 14.6546H69.3915L54.6897 54.6638H45.1935ZM54.1176 44.9527L56.5776 36.9898H77.1716L79.6885 44.9527H54.1176ZM136.663 55.4405C133.536 55.4405 130.619 54.8582 127.911 53.6927C125.241 52.5273 122.915 50.8874 120.932 48.7726C118.987 46.6578 117.462 44.176 116.355 41.3272C115.287 38.4788 114.754 35.3712 114.754 32.0049C114.754 28.6385 115.287 25.5309 116.355 22.6823C117.462 19.8338 119.006 17.3521 120.989 15.2372C122.972 13.1224 125.299 11.4823 127.968 10.317C130.638 9.15167 133.536 8.56903 136.663 8.56903C139.829 8.56903 142.727 9.15167 145.359 10.317C148.028 11.4823 150.335 13.1224 152.281 15.2372C154.264 17.3089 155.808 19.769 156.914 22.6176C158.02 25.4661 158.573 28.5951 158.573 32.0049C158.573 35.3712 158.02 38.5005 156.914 41.392C155.808 44.2408 154.264 46.7222 152.281 48.8374C150.335 50.9087 148.028 52.5273 145.359 53.6927C142.727 54.8582 139.829 55.4405 136.663 55.4405ZM149.763 65.0868C148.2 65.0868 146.713 64.8928 145.301 64.5044C143.929 64.1157 142.556 63.4899 141.183 62.6267C139.848 61.7635 138.437 60.5984 136.949 59.1308C135.5 57.6635 133.918 55.8506 132.201 53.6927L141.926 50.9087C142.956 52.506 143.909 53.7789 144.787 54.7286C145.664 55.6779 146.503 56.3472 147.304 56.7355C148.142 57.1239 149.02 57.3182 149.935 57.3182C152.376 57.3182 154.55 56.1959 156.456 53.9515L160.575 59.5192C157.868 63.2312 154.264 65.0868 149.763 65.0868ZM136.663 46.5065C138.456 46.5065 140.096 46.1612 141.583 45.4707C143.109 44.7801 144.443 43.7877 145.588 42.4927C146.731 41.198 147.609 39.6656 148.219 37.8961C148.867 36.0835 149.191 34.1197 149.191 32.0049C149.191 29.8467 148.867 27.8831 148.219 26.1135C147.609 24.344 146.731 22.8118 145.588 21.517C144.443 20.2222 143.109 19.2295 141.583 18.5389C140.096 17.8484 138.456 17.5031 136.663 17.5031C134.871 17.5031 133.212 17.8484 131.687 18.5389C130.161 19.2295 128.826 20.2222 127.682 21.517C126.576 22.8118 125.699 24.344 125.051 26.1135C124.441 27.8831 124.135 29.8467 124.135 32.0049C124.135 34.1197 124.441 36.0835 125.051 37.8961C125.699 39.6656 126.576 41.198 127.682 42.4927C128.826 43.7877 130.161 44.7801 131.687 45.4707C133.212 46.1612 134.871 46.5065 136.663 46.5065ZM184.702 55.4405C181.613 55.4405 178.733 54.8795 176.064 53.7575C173.432 52.5921 171.144 50.9522 169.199 48.8374C167.254 46.7222 165.729 44.2408 164.622 41.392C163.555 38.5436 163.021 35.4143 163.021 32.0049C163.021 28.5951 163.555 25.4661 164.622 22.6176C165.729 19.769 167.254 17.2873 169.199 15.1725C171.182 13.0577 173.49 11.4392 176.121 10.317C178.752 9.15167 181.632 8.56903 184.759 8.56903C188.229 8.56903 191.357 9.25956 194.141 10.6407C196.963 11.9787 199.327 13.964 201.234 16.5968L195.285 22.8118C193.912 21.0422 192.386 19.7258 190.708 18.8627C189.03 17.9563 187.2 17.5031 185.216 17.5031C183.348 17.5031 181.632 17.8484 180.068 18.5389C178.505 19.2295 177.15 20.2222 176.007 21.517C174.863 22.8118 173.966 24.344 173.318 26.1135C172.708 27.8831 172.403 29.8467 172.403 32.0049C172.403 34.1627 172.708 36.1266 173.318 37.8961C173.966 39.6656 174.863 41.198 176.007 42.4927C177.15 43.7877 178.505 44.7801 180.068 45.4707C181.632 46.1612 183.348 46.5065 185.216 46.5065C187.2 46.5065 189.03 46.0751 190.708 45.2119C192.386 44.3056 193.912 42.9458 195.285 41.1332L201.234 47.348C199.327 49.9811 196.963 51.988 194.141 53.3692C191.357 54.7499 188.21 55.4405 184.702 55.4405Z" fill="white"/>
                    <path d="M89.3504 61.1377L108.228 0.15282H116.18L97.3019 61.1377H89.3504Z" fill="#3FBAC2"/>
                </svg>
            </div>
        :
            <div className='qa-qc__container'>
                <NavbarCmp
                    graph_state={changeState}
                    graph_data={setFilterParams}
                    update_data={setUpdateData}
                ></NavbarCmp>
                {displayOption == true ? 
                <GraphPage
                filteredData={actualGraphData}
                selectedData={undefined}
                setName={setNameNodes}
                defaultData={defaultGraph}
                modalState={openModalState}
                selectNode={selectNode} callBack={undefined}                
                ></GraphPage>
                : 
                <TablePage table={graphTable}></TablePage>
                }
                {openModal ? 
                    <SidebarCmp
                        modalState={openModalState}
                        nameNodes={modalOptionName}
                    ></SidebarCmp>
                    :
                    ''
                }
            </div>
        }
           
        </>
    )
}
