import React, {ReactNode, useCallback} from "react";
import {MockDataData, NODES_DATA} from "./MOCK_DATA";
import TreeCmp, {TreeItem} from "../../components/base/tree-cmp/tree-cmp";
import {ProjectDataDto, queryKeys, service} from "../../utils/api/service";
import {useQuery} from "@tanstack/react-query";
import {useParams, useSearchParams} from "react-router-dom";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";
import {createColumnHelper} from "@tanstack/react-table";
import {TableCmp} from "../../components/base/table-cmp/TableCmp";

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

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.projectNodes(projectId, selectedNode),
        queryFn: () => service.getNodes(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    const columnHelper = createColumnHelper<NodeType>()

    const columns = [
        columnHelper.accessor("deep", {
            header: () => "Глубина",
            cell: (props) => props.getValue()
        }),
        columnHelper.accessor("type", {
            header: () => "Кп_абс",
            cell: (props) => props.getValue()
        }),
        columnHelper.accessor("facia", {
            header: () => "Фации",
            cell: (props) => props.getValue()
        })
    ]

    const getTableData = useCallback((): NodeType[] => {
        const _data: NodeType[] = [];
        data?.forEach((node, index) => {
            _data.push({
                deep: node.values_attributes.Глубина[index],
                type: node.node_data[index],
                facia: ""
            })
        })
        return _data;
    }, [data])

    return (
        <div className={"node-data-info"}>
            {
                (isLoading && !data) ? <LoaderCmp/> :
                    <>
                        <h5>Кп_откр/Core(well: 17b7)</h5>
                        <div className={"node-data-info__table"}>
                            <TableCmp columns={columns} data={getTableData()}/>
                        </div>
                    </>
            }
        </div>
    )
}

const DomainData = ({setContentParams}: ContentTypeProps) => {

    const TypeNodes = [
        {id: "33", type_node: "Кп_откр (well: x18)"},
        {id: "444", type_node: "Кпр_абс (well: x18)"},
        {id: "55", type_node: "Кво (well: x18"}
    ]

    const onSelect = (id: string) => {
        setContentParams(ContentType.TypeNode, id)
    }

    return (
        <div className={"domain-data"}>
            <h5>Core</h5>
            <span>Типы узлов:</span>
            <ul>
                {
                    TypeNodes.map(type =>
                        <li key={type.id} onClick={() => onSelect(type.id)}>{type.type_node}</li>
                    )
                }
            </ul>
        </div>
    )
}

const TypeNodeData = ({setContentParams}: ContentTypeProps) => {

    const Nodes = [
        {id: "33", node: "Кп_откр/Core(well: 17b7)"},
        {id: "444", node: "Кп_откр/Core(well: 17ba)"},
        {id: "55", node: "Кп_откр/Core(well: 54ac)"}
    ]

    const onSelect = (id: string) => {
        setContentParams(ContentType.Node, id)
    }

    return (
        <div className={"domain-data"}>
            <h5>Кп_откр (well: x18)</h5>
            <span>Узлы:</span>
            <ul>
                {
                    Nodes.map(type =>
                        <li key={type.id} onClick={() => onSelect(type.id)}>{type.node}</li>
                    )
                }
            </ul>
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
                children: domain.type_nodes.map(typeNode => {
                    return {
                        value: typeNode.id,
                        label: typeNode.name,
                        children: typeNode.nodes.map(node => {
                            return {
                                value: node.id,
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