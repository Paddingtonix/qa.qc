import TreeCmp, {TreeItem} from "../../components/base/tree-cmp/tree-cmp";
import {useState} from "react";
import {MockDataFiles, NODES_DATA} from "./MOCK_DATA";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {CategoryDto, ProjectFileDto} from "../../utils/api/service";

interface Props {
    categories?: CategoryDto[],
    files?: ProjectFileDto[]
}

const FilesTab = ({categories, files}: Props) => {

    const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);

    return (
        <div className={"files-tab"}>
            <div className={"files-tab__tree"}>
                <TreeCmp
                    items={(files && categories) ? parseProjectFilesToTreeData(files, categories) : []}
                    onSelect={(value) => setSelectedFile(value)}
                    maxDepth={1}
                />
            </div>
            <div>
                <div className={"files-tab__info"}>
                    {
                        selectedFile ?
                            <>
                                <h4>Информация о файле</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                            </>
                            : <h5>Выберете файл</h5>
                    }
                </div>
                {
                    selectedFile &&
                    <div className={"files-tab__table"}>
                        <NodesTable/>
                    </div>
                }
            </div>
        </div>
    )
};

interface NodeType {
    name: string,
    type: string,
    attribute: string
}

const columnHelper = createColumnHelper<NodeType>()

const columns = [
    columnHelper.accessor("name", {
        header: () => "Полное название",
        cell: (props) => props.getValue()
    }),
    columnHelper.accessor("type", {
        header: () => "Тип узла",
        cell: (props) => props.getValue()
    }),
    columnHelper.accessor("attribute", {
        header: () => "Аттрибут уникальности",
        cell: (props) => props.getValue()
    })
]

const NodesTable = () => {

    const [data, setData] = useState(NODES_DATA);

    const table = useReactTable<NodeType>({
        data,
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

function parseProjectFilesToTreeData(files: ProjectFileDto[], categories: CategoryDto[]) {
    const treeData: TreeItem[] = [];
    categories.forEach(category => {
            treeData.push({
                value: category.name,
                label: `${category.name?.toUpperCase()}`,
                children: files.filter(file => file.category === category.name)
                    .map(file => {
                        return {
                            value: file.file_id,
                            label: file.filename
                        }
                    })
            })
        }
    )
    return treeData;
}

export default FilesTab;