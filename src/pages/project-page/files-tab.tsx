import Tree from "../../components/tree/Tree";
import {useState} from "react";
import {MockDataFiles} from "./MOCK_DATA";

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

export default FilesTab;