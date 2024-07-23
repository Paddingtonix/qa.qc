import {useCallback, useState} from "react";
import {MockDataData, NODES_DATA} from "./MOCK_DATA";
import TreeCmp, {TreeItem} from "../../components/base/tree-cmp/tree-cmp";
import {NodeDto, ProjectDataDto, queryKeys, service} from "../../utils/api/service";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

interface Props {
    data?: ProjectDataDto
}

const DataTab = ({data}: Props) => {

    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<"node" | "primary" | undefined>(undefined);
    const {id: projectId} = useParams()

    const {data: nodes, isLoading: loadingNode} = useQuery({
        queryKey: queryKeys.projectNodes(projectId, selectedNode),
        queryFn: () => service.getNodes(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode && selectedCategory === "node"
    })

    const {data: primary, isLoading: loadingPrimary} = useQuery({
        queryKey: queryKeys.projectPrimary(projectId, selectedNode),
        queryFn: () => service.getPrimary(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode && selectedCategory === "primary"
    })

    console.log("Узлы", nodes)
    console.log("Первичные данные", primary)

    return (
        <div className={"data-tab"}>
            <div className={"data-tab__tree"}>
                <TreeCmp
                    items={data ? parseNodeDataToTreeData(data) : []}
                    onSelect={(value) => {
                        setSelectedCategory("node")
                        setSelectedNode(value)
                    }}
                    selectedValue={selectedNode}
                />
                <TreeCmp
                    items={data ? parsePrimaryDataToTreeData(data) : []}
                    onSelect={(value) => {
                        setSelectedCategory("primary")
                        setSelectedNode(value)
                    }}
                    selectedValue={selectedNode}
                />
            </div>
            <div className={"data-tab__info"}>
                {
                    selectedNode ?
                        <>
                            <h4>Информация о {selectedCategory === "node" ? "узле" : "данных"}</h4>
                            {
                                ((selectedCategory === "node" && loadingNode) || (selectedCategory === "primary" && loadingPrimary))
                                    ? <LoaderCmp/> : selectedCategory === "node"
                                        ? <NodeData data={nodes}/>
                                        : <PrimaryData data={primary}/>
                            }
                        </>
                        : <h5>Выберите узел</h5>
                }
            </div>
        </div>
    )
};

interface NodeDataProps {
    data?: NodeDto[]
}

interface NodeType {
    deep?: number,
    type?: number,
    facia?: string
}

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
const NodeData = ({data = []}: NodeDataProps)  => {

    const getTableData = useCallback((): NodeType[] => {
        const _data: NodeType[] = [];
        data?.forEach((node, index) => {
            _data.push({
                deep: node.values_attributes.Глубина[index],
                type: node.node_data[index],
                facia: ""
            })
        })
        console.log(_data)
        return _data;
    }, [data])

    const table = useReactTable<NodeType>({
        data: getTableData(),
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <table className={"table-cmp"}>
            <thead>
            {
                table.getHeaderGroups().map(headerGroup =>
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header =>
                            <th key={header.id} className="text-left">
                                <div>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </div>
                            </th>
                        )}
                    </tr>
                )
            }
            </thead>
            <tbody>
            {
                table.getRowModel().rows.map(row =>
                    <tr key={row.id}>
                        {
                            row.getVisibleCells().map(cell =>
                                <td key={cell.id} className="text-left">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>)
                        }
                    </tr>
                )
            }
            </tbody>
        </table>
    )
}

interface PrimaryDataProps {
    data?: any[]
}

const PrimaryData = ({data}: PrimaryDataProps)  => {
    return (
        <div><p>{JSON.stringify(data)}</p></div>
    )
}

function parseNodeDataToTreeData(data: ProjectDataDto) {
    const treeData: TreeItem[] = [];
    treeData.push({
        value: "Узлы данных",
        label: "Узлы данных",
        children: data.nodes.map(domain => {
            return {
                value: domain.domain,
                label: `Домен "${domain.domain}"`,
                children: domain.type_node.map(typeNode => {
                    return {
                        value: typeNode.id,
                        label: typeNode.value
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