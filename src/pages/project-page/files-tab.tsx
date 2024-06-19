import Tree, {TreeItem} from "../../components/tree/Tree";
import {useState} from "react";

const FilesTab = () => {

    const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);

    return (
        <div className={"files-tab"}>
            <div className={"files-tab__tree"}>
                <Tree
                    items={MockDataFiles}
                    onSelect={(value) => setSelectedFile(value)}
                />
            </div>
            <div>
                <div className={"files-tab__info"}>
                    {
                        selectedFile ?
                            <>
                                <h4>Информация о файле</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                            </>
                            : <h5>Выберете файл</h5>
                    }
                </div>
                <div className={"files-tab__table"}>

                </div>
            </div>
        </div>
    )
};

const MockDataFiles: TreeItem[] = [
    {
        value: "Категория “Данные ГИС”",
        label: "Категория “Данные ГИС”",
        children: [
            { value: "1", label: "Lorem_ipsum_dolor_sit_amet_adipiscing.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    },
    {
        value: "Категория “Данные добычи”",
        label: "Категория “Данные добычи”",
        children: [
            { value: "1", label: "x1.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    },
    {
        value: "Категория “Мнемоники GIS”",
        label: "Категория “Мнемоники GIS”",
        children: [
            { value: "1", label: "x1.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    },
    {
        value: "Категория “Мнемоники Core”",
        label: "Категория “Мнемоники Core”",
        children: [
            { value: "1", label: "x1.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    }
]

export default FilesTab;