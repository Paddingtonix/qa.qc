import "./style.sass"
import {useQuery} from "@tanstack/react-query";
import {queryKeys, service} from "../../../../utils/api/service";
import {createColumnHelper} from "@tanstack/react-table";
import BadgeCmp from "../../../../components/base/badge/badge-cmp";
import React, {useCallback} from "react";
import LoaderCmp from "../../../../components/base/loader-cmp/loader-cmp";
import {TableCmp} from "../../../../components/base/table-cmp/TableCmp";
import {ContentTypeProps} from "../data-tab";

interface PrimaryDataRow {
    key: string,
    values: string | string[] | {}
}

export const PrimaryData = ({selectedNode, projectId}: ContentTypeProps) => {

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.projectPrimary(projectId, selectedNode),
        queryFn: () => service.getPrimary(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    const columnHelper = createColumnHelper<PrimaryDataRow>()

    const columns = [
        columnHelper.accessor("key", {
            header: () => "Ключ",
            cell: (props) => props.getValue(),
        }),
        columnHelper.accessor("values", {
            header: () => "Значения",
            cell: (props) =>
                <div className={"primary-data-table__values-container"}>
                    {renderValues(props.getValue())}
                </div>
        })
    ]

    const renderValues = (values: string | string[] | {}) => {
        if (Array.isArray(values))
            return values.map(value => <BadgeCmp key={value} type={"default"}>{value}</BadgeCmp>)
        else {
            return <BadgeCmp type={"default"}>{typeof (values) === "string" ? values : "-"}</BadgeCmp>
        }
    }

    const getTableData = useCallback((): PrimaryDataRow[] => {
        const _data: PrimaryDataRow[] = [];
        if (!data) return [];
        for (let key in data[0].values) {
            if (data[0].values.hasOwnProperty(key)) {
                _data.push({
                    key: key,
                    values: data[0].values[key]
                })
            }
        }
        return _data
    }, [data])

    return (
        <div className={"domain-data"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data[0].type_data}</h5>
                        <div className={"primary-data-table"}>
                            <TableCmp columns={columns} data={getTableData()}/>
                        </div>
                    </>
            }
        </div>
    )
}
