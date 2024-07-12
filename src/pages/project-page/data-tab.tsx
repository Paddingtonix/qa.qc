import {useState} from "react";
import {MockDataData} from "./MOCK_DATA";
import Tree from "../../components/base/tree/Tree";

const DataTab = () => {

    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);

    return (
        <div className={"data-tab"}>
            <div className={"data-tab__tree"}>
                <Tree
                    items={MockDataData}
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



export default DataTab;