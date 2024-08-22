import "./style.sass"
import React, {useCallback, useState} from "react";
import {queryKeys, service} from "../../../../utils/api/service";
import {createColumnHelper} from "@tanstack/react-table";
import LoaderCmp from "../../../../components/base/loader-cmp/loader-cmp";
import {TableCmp} from "../../../../components/base/table-cmp/TableCmp";
import InputCmp from "../../../../components/base/input-cmp/input-cmp";
import {useQuery} from "@tanstack/react-query";
import {ContentTypeProps} from "../data-tab";

export const NodeData = ({selectedNode, projectId}: ContentTypeProps) => {

    const [node, typeNode] = selectedNode.split("_")
    const [decimalPlaces, setDecimalPlaces] = useState<string>("");

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.nodeData(projectId, selectedNode),
        queryFn: () => service.getNodeData(projectId || "", typeNode, node),
        select: ({data}) => data,
        enabled: !!projectId && !!node && !!typeNode
    })

    const columnHelper = createColumnHelper<any>()

    const getColumns = useCallback(() => {
        const columns = [
            columnHelper.accessor("node_data", {
                header: () => data?.name.split("/")[0],
                cell: (props) => formatTableValue(props.getValue(), decimalPlaces)
            })
        ]
        for (let key in data?.values_attributes) {
            if (data?.values_attributes.hasOwnProperty(key) && Array.isArray(data?.values_attributes[key])) {
                columns.push(
                    columnHelper.accessor(key, {
                        header: () => key?.toUpperCase(),
                        cell: (props) =>
                            Number.isNaN(data?.values_attributes[key][0])
                                ? formatTableValue(props.getValue(), decimalPlaces)
                                :  props.getValue()
                    })
                )
            }
        }
        return columns;
    }, [data, decimalPlaces])

    const getTableData = useCallback((): any[] => {
        const _data: any[] = [];
        data?.node_data.forEach((node, index) => {
            _data.push({
                node_data: node,
                ...Object.fromEntries(
                    Object
                        .entries(data.values_attributes)
                        .map(attribute =>
                            [
                                attribute[0],
                                Array.isArray(attribute[1]) ? attribute[1][index] : attribute[1]
                            ]
                        )
                ),
            })
        })
        return _data;
    }, [data])

    return (
        <div className={"node-data-info"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data.name}</h5>
                        <div className={"node-data-info__table"}>
                            <TableCmp columns={getColumns()} data={getTableData()}/>
                        </div>
                        <InputCmp
                            label={"Кол-во знаков после запятой"}
                            value={decimalPlaces}
                            onChange={(value) => setDecimalPlaces(value)}
                            type={"number"}
                        />
                    </>
            }
        </div>
    )
}

function formatTableValue(value: number | undefined, decimalPlaces: string) {
    if (!value) return "-"
    if (decimalPlaces && Number(decimalPlaces) < 100 && Number(decimalPlaces) >= 0)
        return parseFloat(value.toFixed(Number(decimalPlaces)))
    return value
}