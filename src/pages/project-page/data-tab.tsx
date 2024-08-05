import React, {ReactNode, useCallback, useState} from "react";
import {MockDataData, NODES_DATA} from "./MOCK_DATA";
import TreeCmp, {TreeItem} from "../../components/base/tree-cmp/tree-cmp";
import {ProjectDataDto, queryKeys, service} from "../../utils/api/service";
import {useQuery} from "@tanstack/react-query";
import {useParams, useSearchParams} from "react-router-dom";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";
import {createColumnHelper} from "@tanstack/react-table";
import {TableCmp} from "../../components/base/table-cmp/TableCmp";
import InputCmp from "../../components/base/input-cmp/input-cmp";

interface Props {
    data?: ProjectDataDto
}

enum ContentType {
    Domain = "domain",
    TypeNode = "type-node",
    Node = "node",
    Primary = "primary",
    Null = "null"
}

const contentParamKey = "c";
const nodeParamKey = "n";

interface ContentTypeOptionsItem {
    title?: string,
    content?: ReactNode
}

const DataTab = ({data}: Props) => {

    const [params, setParams] = useSearchParams()
    const {id: projectId} = useParams()

    const currentContentType = params.get(contentParamKey) as ContentType || ContentType.Null;
    const selectedNode = params.get(nodeParamKey) as string || "";

    const setContentParams = (contentType: ContentType, nodeId: string) => {
        setParams(searchParams => {
            searchParams.set(contentParamKey, contentType !== ContentType.Null ? contentType : "");
            searchParams.set(nodeParamKey, nodeId);
            return searchParams;
        });
    }

    const ContentTypeOptions: Record<ContentType, ContentTypeOptionsItem> = {
        [ContentType.Domain]: {
            title: "Домен",
            content: <DomainData selectedNode={selectedNode} projectId={projectId || ""} setContentParams={setContentParams}/>
        },
        [ContentType.TypeNode]: {
            title: "Тип узла",
            content: <TypeNodeData selectedNode={selectedNode} projectId={projectId || ""} setContentParams={setContentParams}/>
        },
        [ContentType.Node]: {
            title: "Узел",
            content: <NodeData selectedNode={selectedNode} projectId={projectId || ""} setContentParams={setContentParams}/>
        },
        [ContentType.Primary]: {
            title: "Информация о первичных данных",
            content: <PrimaryData selectedNode={selectedNode} projectId={projectId || ""} setContentParams={setContentParams}/>
        },
        [ContentType.Null]: {
            content: <h5>Выберите узел</h5>
        }
    }

    const NodeContentTypeDeep: Record<number, ContentType> = {
        0: ContentType.Null,
        1: ContentType.Domain,
        2: ContentType.TypeNode,
        3: ContentType.Node
    }

    const PrimaryContentTypeDeep: Record<number, ContentType> = {
        0: ContentType.Null,
        1: ContentType.Null,
        2: ContentType.Primary
    }

    const onSelectNode = useCallback((type: "availableData" | "primaryData", value: string, deep: number) => {
        if (deep === 0) return;
        setContentParams(
            type === "availableData" ? NodeContentTypeDeep[deep] : PrimaryContentTypeDeep[deep],
            value
        )
    }, [])

    return (
        <div className={"data-tab"}>
            <div className={"data-tab__tree"}>
                <div>
                    <TreeCmp
                        items={data ? parseNodeDataToTreeData(data) : []}
                        onSelect={(value, deep) => onSelectNode("availableData", value, deep)}
                        selectedValue={selectedNode}
                    />
                    <TreeCmp
                        items={data ? parsePrimaryDataToTreeData(data) : []}
                        onSelect={(value, deep) => onSelectNode("primaryData", value, deep)}
                        selectedValue={selectedNode}
                    />
                </div>
            </div>
            <div className={"data-tab__info"}>
                <h4>{ContentTypeOptions[currentContentType]?.title}</h4>
                {ContentTypeOptions[currentContentType]?.content}
            </div>
        </div>
    )
};

interface ContentTypeProps {
    projectId: string,
    selectedNode: string,
    setContentParams(contentType: ContentType, nodeId: string): void
}

interface NodeType {
    deep?: number,
    type?: number,
    facia?: string
}

const NodeData = ({selectedNode, projectId}: ContentTypeProps) => {

    const [node, typeNode] = selectedNode.split("_")
    const [decimalPlaces, setDecimalPlaces] = useState<string>("");

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.nodeData(projectId, selectedNode),
        queryFn: () => service.getNodeData(projectId || "", typeNode, node),
        select: ({data}) => data,
        enabled: !!projectId && !!node && !!typeNode
    })

    const columnHelper = createColumnHelper<NodeType>()

    const columns = [
        columnHelper.accessor("deep", {
            header: () => "Глубина",
            cell: (props) => formatTableValue(props.getValue(), decimalPlaces)
        }),
        columnHelper.accessor("type", {
            header: () => data?.name.split("/")[0],
            cell: (props) => formatTableValue(props.getValue(), decimalPlaces)
        }),
        columnHelper.accessor("facia", {
            header: () => "Фации",
            cell: (props) => props.getValue()
        })
    ]

    const getTableData = useCallback((): NodeType[] => {
        const _data: NodeType[] = [];
        data?.node_data.forEach((node, index) => {
            _data.push({
                deep: data.values_attributes.Глубина[index],
                type: data.node_data[index],
                facia: ""
            })
        })
        return _data;
    }, [data])

    return (
        <div className={"node-data-info"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data.name}</h5>
                        <div className={"node-data-info__table"}>
                            <TableCmp columns={columns} data={getTableData()}/>
                        </div>
                        <InputCmp
                            label={"Кол-во знаков после запятой"}
                            value={decimalPlaces}
                            onChange={(value) => setDecimalPlaces(value)}
                            type={"number"}
                        />
                    </>
            }
        </div>
    )
}

function formatTableValue(value: number | undefined, decimalPlaces: string) {
    if (!value) return "-"
    if (decimalPlaces && Number(decimalPlaces) < 100 && Number(decimalPlaces) >= 0)
        return parseFloat(value.toFixed(Number(decimalPlaces)))
    return value
}

const DomainData = ({setContentParams, projectId, selectedNode}: ContentTypeProps) => {

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.domainData(projectId, selectedNode),
        queryFn: () => service.getDomainData(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    const onSelect = (id: string) => {
        setContentParams(ContentType.TypeNode, id)
    }

    return (
        <div className={"domain-data"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data.name}</h5>
                        <span>Типы узлов:</span>
                        <ul>
                            {
                                data.type_nodes_list.map(type =>
                                    <li key={type.id} onClick={() => onSelect(type.id)}>{type.type_name}</li>
                                )
                            }
                        </ul>
                    </>
            }
        </div>
    )
}

const TypeNodeData = ({setContentParams, projectId, selectedNode}: ContentTypeProps) => {

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.typeNodeData(projectId, selectedNode),
        queryFn: () => service.getTypeNodeData(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    const onSelect = (id: string) => {
        setContentParams(ContentType.Node, id)
    }

    return (
        <div className={"domain-data"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data.type_name}</h5>
                        <span>Узлы:</span>
                        <ul>
                            {
                                data.node_list.map(node =>
                                    <li
                                        key={`${node.id}_${data.id}`}
                                        onClick={() => onSelect(`${node.id}_${data.id}`)}
                                    >{node.name}</li>
                                )
                            }
                        </ul>
                    </>
            }
        </div>
    )
}

const PrimaryData = ({selectedNode, projectId}: ContentTypeProps) => {

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.projectPrimary(projectId, selectedNode),
        queryFn: () => service.getPrimary(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    return (
        <div>
            {
                (isLoading && !data) ? <LoaderCmp/> :
                    <p>{JSON.stringify(data)}</p>
            }
        </div>
    )
}

function parseNodeDataToTreeData(data: ProjectDataDto) {
    const treeData: TreeItem[] = [];
    treeData.push({
        value: "Узлы данных",
        label: "Узлы данных",
        children: data.domains.map(domain => {
            return {
                value: domain.name,
                label: `Домен "${domain.name}"`,
                children: domain.type_nodes_list.map(typeNode => {
                    return {
                        value: typeNode.id,
                        label: typeNode.name,
                        children: typeNode.nodes.map(node => {
                            return {
                                value: `${node.id}_${typeNode.id}`,
                                label: node.name,
                            }
                        })
                    }
                })
            }
        })
    })
    return treeData;
}

function parsePrimaryDataToTreeData(data: ProjectDataDto) {
    const treeData: TreeItem[] = [];
    treeData.push({
        value: "Первичные данные",
        label: "Первичные данные",
        children: data.primary.map(domain => {
            return {
                value: domain.domain,
                label: `Домен "${domain.domain}"`,
                children: domain.type_data.map(typeData => {
                    return {
                        value: typeData,
                        label: typeData
                    }
                })
            }
        })
    })
    return treeData;
}

export default DataTab;