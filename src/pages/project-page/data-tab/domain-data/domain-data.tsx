import "./style.sass"
import {useQuery} from "@tanstack/react-query";
import {queryKeys, service} from "../../../../utils/api/service";
import LoaderCmp from "../../../../components/base/loader-cmp/loader-cmp";
import React from "react";
import {ContentType, ContentTypeProps} from "../data-tab";

export const DomainData = ({setContentParams, projectId, selectedNode}: ContentTypeProps) => {

    const {data, isLoading} = useQuery({
        queryKey: queryKeys.domainData(projectId, selectedNode),
        queryFn: () => service.getDomainData(projectId || "", selectedNode || ""),
        select: ({data}) => data,
        enabled: !!projectId && !!selectedNode
    })

    const onSelect = (id: string) => {
        setContentParams(ContentType.TypeNode, id)
    }

    return (
        <div className={"domain-data"}>
            {
                (isLoading || !data) ? <LoaderCmp/> :
                    <>
                        <h5>{data.name}</h5>
                        <span>Типы узлов:</span>
                        <ul>
                            {
                                data.type_nodes_list.map(type =>
                                    <li key={type.id} onClick={() => onSelect(type.id)}>{type.type_name}</li>
                                )
                            }
                        </ul>
                    </>
            }
        </div>
    )
}