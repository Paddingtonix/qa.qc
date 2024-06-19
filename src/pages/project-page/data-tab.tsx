import Tree, {TreeItem} from "../../components/tree/Tree";
import {useState} from "react";

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

const MockDataData: TreeItem[] = [
    {
        value: "Узлы данных",
        label: "Узлы данных",
        children: [
            {
                value: "Домен “Керн”",
                label: "Домен “Керн”",
                children: [
                    {
                        value: "Тип узла (Кп_абс)",
                        label: "Тип узла (Кп_абс)",
                        children: [
                            {value: "Кп_абс/CORE (well: 888)", label: "Кп_абс/CORE (well: x1)"}
                        ]
                    }
                ]
            },
            {
                value: "Домен “WELLS”",
                label: "Домен “WELLS”",
                children: [
                    {
                        value: "Тип узла (OPR)",
                        label: "Тип узла (OPR)",
                        children: [
                            {value: "Кп_абс/CORE (well: x77)", label: "Кп_абс/CORE (well: x1)"},
                            {value: "Кп_абс/CORE (well: x2)", label: "Кп_абс/CORE (well: x1)"},
                            {value: "Кп_абс/CORE (well: x3)", label: "Кп_абс/CORE (well: x1)"},
                            {value: "Кп_абс/CORE (well: x5)", label: "Кп_абс/CORE (well: x1)"}
                        ]
                    }
                ]
            },
        ]
    },
    {
        value: "Вспомогательные данные",
        label: "Вспомогательные данные",
        children: [
            {
                value: "Домен “Керн”",
                label: "Домен “Керн”",
                children: [
                    {
                        value: "Тип узла (Кп_абс)",
                        label: "Тип узла (Кп_абс)",
                        children: [
                            {value: "Кп_абс/CORE (well: x1)", label: "Кп_абс/CORE (well: x1)"}
                        ]
                    }
                ]
            },
        ]
    }
]

export default DataTab;