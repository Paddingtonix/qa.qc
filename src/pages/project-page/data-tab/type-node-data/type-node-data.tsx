import "./style.sass"
import {useQuery} from "@tanstack/react-query";
import {queryKeys, service} from "../../../../utils/api/service";
import LoaderCmp from "../../../../components/base/loader-cmp/loader-cmp";
import React from "react";
import {ContentType, ContentTypeProps} from "../data-tab";

export const TypeNodeData = ({setContentParams, projectId, selectedNode}: ContentTypeProps) => {

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.typeNodeData(projectId, selectedNode),
        queryFn: () => service.getTypeNodeData(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    const onSelect = (id: string) => {
        setContentParams(ContentType.Node, id)
    }

    return (
        <div className={"type-node-data"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data.type_name}</h5>
                        <span>Узлы:</span>
                        <ul>
                            {
                                data.node_list.map(node =>
                                    <li
                                        key={`${node.id}_${data.id}`}
                                        onClick={() => onSelect(`${node.id}_${data.id}`)}
                                    >{node.name}</li>
                                )
                            }
                        </ul>
                    </>
            }
        </div>
    )
}