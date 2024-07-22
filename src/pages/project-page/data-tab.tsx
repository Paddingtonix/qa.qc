import {useState} from "react";
import {MockDataData} from "./MOCK_DATA";
import TreeCmp, {TreeItem} from "../../components/base/tree-cmp/tree-cmp";
import {ProjectDataDto, queryKeys, service} from "../../utils/api/service";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";

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
                                (selectedCategory === "node" && loadingNode || selectedCategory === "primary" && loadingPrimary)
                                    ? <LoaderCmp/> : <div><p>{JSON.stringify(selectedCategory === "node" ? nodes : primary)}</p></div>
                            }
                        </>
                        : <h5>Выберете узел</h5>
                }
            </div>
        </div>
    )
};

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