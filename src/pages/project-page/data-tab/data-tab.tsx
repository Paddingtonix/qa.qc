import "./style.sass";
import React, {ReactNode, useCallback, useEffect, useState} from "react";
import TreeCmp, {TreeItem} from "../../../components/base/tree-cmp/tree-cmp";
import {
    ProjectDataDomainDto,
    ProjectDataDto,
    ProjectDataNodeDto,
    ProjectDataTypeNodeDto, ProjectPrimaryDataDomainDto
} from "../../../utils/api/service";
import {useParams, useSearchParams} from "react-router-dom";
import {DomainData} from "./domain-data/domain-data";
import {TypeNodeData} from "./type-node-data/type-node-data";
import {NodeData} from "./node-data/node-data";
import {PrimaryData} from "./primary-data/primary-data";
import CardCmp from "../../../components/base/card-cmp/card-cmp";
import InputCmp from "../../../components/base/input-cmp/input-cmp";
import TabsCmp from "../../../components/base/tabs-cmp/tabs-cmp";
import {useOutsideClick} from "../../../utils/hooks/use-outside-click";
import {CheckboxCmp} from "../../../components/base/checkbox-cmp/checkbox-cmp";

interface Props {
    data?: ProjectDataDto
}

export enum ContentType {
    Domain = "domain",
    TypeNode = "type-node",
    Node = "node",
    Primary = "primary",
    Null = "null"
}

export enum DataType {
    Nodes = "nodes",
    Primary = "primary"
}

const dataParamKey = "d"
const contentParamKey = "c";
const nodeParamKey = "n";

interface ContentTypeOptionsItem {
    title?: string,
    content?: ReactNode
}

const DataTab = ({data}: Props) => {

    const [params, setParams] = useSearchParams()
    const {id: projectId} = useParams()
    const [dataSearchParams, setDataSearchParams] = useState<DataSearchParams>({string: "", category: NodeDataSearchParamsCategory.Node})

    const currentContentType = params.get(contentParamKey) as ContentType || ContentType.Null;
    const currentDataType = params.get(dataParamKey) as DataType || DataType.Nodes;
    const selectedNode = params.get(nodeParamKey) as string || "";

    useEffect(() => {
        setDataSearchParams({
            string: dataSearchParams.string,
            category: currentDataType === DataType.Nodes ? NodeDataSearchParamsCategory.Node : PrimaryDataSearchParamsCategory.Data
        })
    }, [currentDataType])

    const setContentParams = (contentType: ContentType, nodeId: string) => {
        setParams(searchParams => {
            searchParams.set(contentParamKey, contentType !== ContentType.Null ? contentType : "");
            searchParams.set(nodeParamKey, nodeId);
            return searchParams;
        });
    }

    const setDataTypeParams = (dataType: DataType) => {
        setParams(searchParams => {
            searchParams.set(dataParamKey, dataType);
            return searchParams;
        });
    }

    const ContentTypeOptions: Record<ContentType, ContentTypeOptionsItem> = {
        [ContentType.Domain]: {
            title: "Домен",
            content: <DomainData selectedNode={selectedNode} projectId={projectId || ""}
                                 setContentParams={setContentParams}/>
        },
        [ContentType.TypeNode]: {
            title: "Тип узла",
            content: <TypeNodeData selectedNode={selectedNode} projectId={projectId || ""}
                                   setContentParams={setContentParams}/>
        },
        [ContentType.Node]: {
            title: "Узел",
            content: <NodeData selectedNode={selectedNode} projectId={projectId || ""}
                               setContentParams={setContentParams}/>
        },
        [ContentType.Primary]: {
            title: "Информация о первичных данных",
            content: <PrimaryData selectedNode={selectedNode} projectId={projectId || ""}
                                  setContentParams={setContentParams}/>
        },
        [ContentType.Null]: {
            content: <h5>Выберите узел</h5>
        }
    }

    const NodeContentTypeDeep: Record<number, ContentType> = {
        0: ContentType.Domain,
        1: ContentType.TypeNode,
        2: ContentType.Node
    }

    const PrimaryContentTypeDeep: Record<number, ContentType> = {
        0: ContentType.Null,
        1: ContentType.Primary
    }

    const onSelectNodes = useCallback((value: string, deep: number) => {
        setContentParams(NodeContentTypeDeep[deep], value)
    }, [setContentParams, currentDataType])

    const onSelectPrimary = useCallback((value: string, deep: number) => {
        setContentParams(PrimaryContentTypeDeep[deep], value)
    }, [setContentParams, currentDataType])

    return (
        <div className={"data-tab"}>
            <CardCmp className={"data-tab__tree"}>
                <TabsCmp
                    borderAlign={"top"}
                    items={[
                        {key: DataType.Nodes, title: "Узлы данных"},
                        {key: DataType.Primary, title: "Первичные данные"},
                    ]}
                    selectedTab={currentDataType}
                    onSelect={key => setDataTypeParams(key as DataType)}
                />
                <SearchPanel
                    params={dataSearchParams}
                    mode={currentDataType}
                    setParams={(params) => setDataSearchParams({...params})}
                />
                <div>
                    <TreeCmp
                        className={currentDataType !== DataType.Nodes ? "data-tab__tree_hidden" : ""}
                        items={data ? parseNodeDataToTreeData(data, {
                            string: dataSearchParams.string,
                            category: dataSearchParams.category
                        }) : []}
                        onSelect={(value, deep) => onSelectNodes(value, deep)}
                        selectedValue={selectedNode}
                    />
                    <TreeCmp
                        className={currentDataType !== DataType.Primary ? "data-tab__tree_hidden" : ""}
                        items={data ? parsePrimaryDataToTreeData(data, {
                            string: dataSearchParams.string,
                            category: dataSearchParams.category
                        }) : []}
                        onSelect={(value, deep) => onSelectPrimary(value, deep)}
                        selectedValue={selectedNode}
                    />
                </div>
            </CardCmp>
            <CardCmp className={"data-tab__info"}>
                <h4>{ContentTypeOptions[currentContentType]?.title}</h4>
                {ContentTypeOptions[currentContentType]?.content}
            </CardCmp>
        </div>
    )
};

interface SearchPanelProps {
    params: DataSearchParams,
    mode: DataType
    setParams(params: DataSearchParams): void
}

interface DataSearchParams {
    string: string,
    category: NodeDataSearchParamsCategory | PrimaryDataSearchParamsCategory
}

const SearchPanel = ({params, mode, setParams}: SearchPanelProps) => {

    const [open, setOpen] = useState(false);
    const ref = useOutsideClick(() => {
        setOpen(false)
    })

    return (
        <div className={"data-search-input"}>
            <InputCmp
                label={"Поиск"}
                value={params.string}
                onChange={(value) => setParams({...params, string: value})}
            />
            <div className={"data-search-input__settings"} ref={ref}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpen(!open)}>
                    <path d="M12 7L20 7" stroke="#222222" strokeLinecap="round"/>
                    <path d="M4 7L8 7" stroke="#222222" strokeLinecap="round"/>
                    <path d="M17 17L20 17" stroke="#222222" strokeLinecap="round"/>
                    <path d="M4 17L12 17" stroke="#222222" strokeLinecap="round"/>
                    <circle cx="10" cy="7" r="2" transform="rotate(90 10 7)" stroke="#222222" strokeLinecap="round"/>
                    <circle cx="15" cy="17" r="2" transform="rotate(90 15 17)" stroke="#222222" strokeLinecap="round"/>
                </svg>
                {
                    open ?
                        <div>
                            <h5>Поиск:</h5>
                            {
                                Object.keys(mode === DataType.Nodes ? NodeDataSearchParamsCategory : PrimaryDataSearchParamsCategory)
                                    .filter(value => !isNaN(Number(value))).map(category =>
                                            <span key={category}>
                                                <CheckboxCmp
                                                    selected={params.category === Number(category)}
                                                    onClick={() => setParams({...params, category: Number(category)})}
                                                />
                                                <label>{
                                                    mode === DataType.Nodes
                                                        ? NodeDataSearchParamsCategoryName[category as unknown as NodeDataSearchParamsCategory]
                                                        : PrimaryDataSearchParamsCategoryName[category as unknown as PrimaryDataSearchParamsCategory]
                                                }</label>
                                            </span>
                                    )
                            }
                        </div> : undefined
                }
            </div>
        </div>
    )
}

export interface ContentTypeProps {
    projectId: string,
    selectedNode: string,

    setContentParams(contentType: ContentType, nodeId: string): void
}



enum NodeDataSearchParamsCategory {
    Domain = 1,
    TypeNode = 2,
    Node = 3
}

const NodeDataSearchParamsCategoryName: Record<NodeDataSearchParamsCategory, string> = {
    [NodeDataSearchParamsCategory.Domain]: "По доменам",
    [NodeDataSearchParamsCategory.TypeNode]: "По типам узлов",
    [NodeDataSearchParamsCategory.Node]: "По узлам",
}

enum PrimaryDataSearchParamsCategory {
    Domain = 1,
    Data = 2
}

const PrimaryDataSearchParamsCategoryName: Record<PrimaryDataSearchParamsCategory, string> = {
    [PrimaryDataSearchParamsCategory.Domain]: "По доменам",
    [PrimaryDataSearchParamsCategory.Data]: "По данным",
}

function parseNodeDataToTreeData(data: ProjectDataDto, search: DataSearchParams) {
    const parseDomains = (domains: ProjectDataDomainDto[]) => {

        const domainsRaw = search.category === NodeDataSearchParamsCategory.Domain
            ? domains.filter(domain => compareTwoString(domain.name, search.string))
            : domains

        return domainsRaw.map(domain => {
            return {
                value: domain.name,
                label: `Домен "${domain.name}"`,
                children: parseTypeNodes(domain.type_nodes_list)
            }
        })
    }

    const parseTypeNodes = (typeNodes: ProjectDataTypeNodeDto[]) => {

        const typeNodesRaw = search.category === NodeDataSearchParamsCategory.TypeNode
            ? typeNodes.filter(typeNode => compareTwoString(typeNode.name, search.string))
            : typeNodes

        return typeNodesRaw.map(typeNode => {
            return {
                value: typeNode.id,
                label: typeNode.name,
                children: parseNodes(typeNode.nodes, typeNode.id)
            }
        })
    }

    const parseNodes = (nodes: ProjectDataNodeDto[], typeNodeId: string) => {

        const nodesRaw = search.category === NodeDataSearchParamsCategory.Node
            ? nodes.filter(node => compareTwoString(node.name, search.string))
            : nodes

        return nodesRaw.map(node => {
            return {value: `${node.id}_${typeNodeId}`, label: node.name}
        })
    }

    let treeData: TreeItem[] = [...parseDomains(data.domains)]

    if (!search.string.length) return treeData;

    const treeDataFiltered =
        isHasChildren({value: "", label: "", children: treeData}, 0, search.category)

    return (treeDataFiltered?.children ? [...treeDataFiltered.children] : [])
}

function compareTwoString(str1: string, str2: string) {
    if (!str2.length) return true;
    return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1
}

function isHasChildren(treeItem: TreeItem, currentCategory: NodeDataSearchParamsCategory, searchCategory: NodeDataSearchParamsCategory | PrimaryDataSearchParamsCategory): TreeItem | undefined {
    if (currentCategory === searchCategory - 1)
        return treeItem.children?.length ? treeItem : undefined

    const children = treeItem.children?.map(children => isHasChildren(children, currentCategory + 1, searchCategory))?.filter(children => !!children) as (TreeItem[] | undefined);

    if (children?.length)
        return {...treeItem, children}
    return undefined;
}

function parsePrimaryDataToTreeData(data: ProjectDataDto, search: DataSearchParams) {

    const parseDomains = (domains: ProjectPrimaryDataDomainDto[]) => {

        const domainsRaw = search.category === PrimaryDataSearchParamsCategory.Domain
            ? domains.filter(domain => compareTwoString(domain.domain, search.string))
            : domains

        return domainsRaw.map(domain => {
            return {
                value: domain.domain,
                label: `Домен "${domain.domain}"`,
                children: parseData(domain.type_data)
            }
        })
    }

    const parseData = (primaryData: string[]) => {

        const primaryDataRaw = search.category === PrimaryDataSearchParamsCategory.Data
            ? primaryData.filter(data => compareTwoString(data, search.string))
            : primaryData

        return primaryDataRaw.map(data => {
            return {
                value: data,
                label: data
            }
        })
    }

    let treeData: TreeItem[] = [...parseDomains(data.primary)]

    if (!search.string.length) return treeData;

    const treeDataFiltered =
        isHasChildren({value: "", label: "", children: treeData}, 0, search.category)

    return (treeDataFiltered?.children ? [...treeDataFiltered.children] : [])
}

export default DataTab;