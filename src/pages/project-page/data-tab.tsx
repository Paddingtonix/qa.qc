import {useState} from "react";
import {MockDataData} from "./MOCK_DATA";
import Tree, {TreeItem} from "../../components/base/tree/Tree";
import {ProjectDataDto} from "../../utils/api/service";

interface Props {
    data?: ProjectDataDto
}

const DataTab = ({data}: Props) => {

    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);

    return (
        <div className={"data-tab"}>
            <div className={"data-tab__tree"}>
                <Tree
                    items={data ? parseProjectDataToTreeData(data) : []}
                    onSelect={(value) => setSelectedNode(value)}
                />
            </div>
            <div className={"data-tab__info"}>
                {
                    selectedNode ?
                        <>
                            <h4>Информация о узле</h4>
                            <p>Malesuada nunc vel risus commodo viverra maecenas accumsan. Turpis egestas integer eget aliquet nibh praesent tristique magna. Eget nulla facilisi etiam dignissim diam quis enim lobortis. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris. Amet cursus sit amet dictum sit amet justo donec. Eleifend quam adipiscing vitae proin sagittis nisl.</p>
                        </>
                        : <h5>Выберете узел</h5>
                }
            </div>
        </div>
    )
};

function parseProjectDataToTreeData(data: ProjectDataDto) {
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
    treeData.push({
        value: "Вспомогательные данные",
        label: "Вспомогательные данные",
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