import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import React from "react";
import "./style.sass"

interface TableProps<T> {
    data?: Array<T>,
    columns: any[]
}

export const TableCmp = <T, >({data = [], columns}: TableProps<T>) => {

    const table = useReactTable<T>({
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