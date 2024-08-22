import "./style.sass";
import React, {ReactNode, useCallback, useState} from "react";
import TreeCmp, {TreeItem} from "../../../components/base/tree-cmp/tree-cmp";
import {
    ProjectDataDomainDto,
    ProjectDataDto,
    ProjectDataNodeDto,
    ProjectDataTypeNodeDto
} from "../../../utils/api/service";
import {useParams, useSearchParams} from "react-router-dom";
import {DomainData} from "./domain-data/domain-data";
import {TypeNodeData} from "./type-node-data/type-node-data";
import {NodeData} from "./node-data/node-data";
import {PrimaryData} from "./primary-data/primary-data";
import CardCmp from "../../../components/base/card-cmp/card-cmp";
import InputCmp from "../../../components/base/input-cmp/input-cmp";

interface Props {
    data?: ProjectDataDto
}
export enum ContentType {
    Domain = "domain",
    TypeNode = "type-node",
    Node = "node",
    Primary = "primary",
    Null = "null"
}

const contentParamKey = "c";
const nodeParamKey = "n";

interface ContentTypeOptionsItem {
    title?: string,
    content?: ReactNode
}

const DataTab = ({data}: Props) => {

    const [params, setParams] = useSearchParams()
    const {id: projectId} = useParams()

    const currentContentType = params.get(contentParamKey) as ContentType || ContentType.Null;
    const selectedNode = params.get(nodeParamKey) as string || "";

    const setContentParams = (contentType: ContentType, nodeId: string) => {
        setParams(searchParams => {
            searchParams.set(contentParamKey, contentType !== ContentType.Null ? contentType : "");
            searchParams.set(nodeParamKey, nodeId);
            return searchParams;
        });
    }

    const ContentTypeOptions: Record<ContentType, ContentTypeOptionsItem> = {
        [ContentType.Domain]: {
            title: "Домен",
            content: <DomainData selectedNode={selectedNode} projectId={projectId || ""}
                                 setContentParams={setContentParams}/>
        },
        [ContentType.TypeNode]: {
            title: "Тип узла",
            content: <TypeNodeData selectedNode={selectedNode} projectId={projectId || ""}
                                   setContentParams={setContentParams}/>
        },
        [ContentType.Node]: {
            title: "Узел",
            content: <NodeData selectedNode={selectedNode} projectId={projectId || ""}
                               setContentParams={setContentParams}/>
        },
        [ContentType.Primary]: {
            title: "Информация о первичных данных",
            content: <PrimaryData selectedNode={selectedNode} projectId={projectId || ""}
                                  setContentParams={setContentParams}/>
        },
        [ContentType.Null]: {
            content: <h5>Выберите узел</h5>
        }
    }

    const NodeContentTypeDeep: Record<number, ContentType> = {
        0: ContentType.Null,
        1: ContentType.Domain,
        2: ContentType.TypeNode,
        3: ContentType.Node
    }

    const PrimaryContentTypeDeep: Record<number, ContentType> = {
        0: ContentType.Null,
        1: ContentType.Null,
        2: ContentType.Primary
    }

    const onSelectNode = useCallback((type: "availableData" | "primaryData", value: string, deep: number) => {
        if (deep === 0) return;
        setContentParams(
            type === "availableData" ? NodeContentTypeDeep[deep] : PrimaryContentTypeDeep[deep],
            value
        )
    }, [])

    const [searchValue, setSearchValue] = useState("");

    return (
        <div className={"data-tab"}>
            <CardCmp className={"data-tab__tree"}>
                <div>
                    <div className={"data-tab__tree__search-input"}>
                        <InputCmp
                            label={"Введите название"}
                            value={searchValue}
                            onChange={(value) => setSearchValue(value)}
                        />
                    </div>
                    <TreeCmp
                        items={data ? parseNodeDataToTreeData(data, {string: searchValue, category: NodeDataSearchParamsCategory.Domain}) : []}
                        onSelect={(value, deep) => onSelectNode("availableData", value, deep)}
                        selectedValue={selectedNode}
                    />
                    <TreeCmp
                        items={data ? parsePrimaryDataToTreeData(data) : []}
                        onSelect={(value, deep) => onSelectNode("primaryData", value, deep)}
                        selectedValue={selectedNode}
                    />
                </div>
            </CardCmp>
            <CardCmp className={"data-tab__info"}>
                <h4>{ContentTypeOptions[currentContentType]?.title}</h4>
                {ContentTypeOptions[currentContentType]?.content}
            </CardCmp>
        </div>
    )
};

export interface ContentTypeProps {
    projectId: string,
    selectedNode: string,

    setContentParams(contentType: ContentType, nodeId: string): void
}

type NodeDataSearchParams = {
    string: string,
    category: NodeDataSearchParamsCategory
}

enum NodeDataSearchParamsCategory {
    Domain = 1,
    TypeNode = 2,
    Node = 3
}

function parseNodeDataToTreeData(data: ProjectDataDto, search: NodeDataSearchParams) {
    const treeData: TreeItem[] = [];

    const parseDomains = (domains: ProjectDataDomainDto[]) => {

        const domainsRaw = search.category === NodeDataSearchParamsCategory.Domain
            ? domains.filter(domain => compareTwoString(domain.name, search.string))
            : domains

        return domainsRaw.map(domain => {
            return {
                value: domain.name,
                label: `Домен "${domain.name}"`,
                children: parseTypeNodes(domain.type_nodes_list)
            }
        })
    }

    const parseTypeNodes = (typeNodes: ProjectDataTypeNodeDto[]) => {

        const typeNodesRaw = search.category === NodeDataSearchParamsCategory.TypeNode
            ? typeNodes.filter(typeNode => compareTwoString(typeNode.name, search.string))
            : typeNodes

        return typeNodesRaw.map(typeNode => {
            return {
                value: typeNode.id,
                label: typeNode.name,
                children: parseNodes(typeNode.nodes, typeNode.id)
            }
        })
    }

    const parseNodes = (nodes: ProjectDataNodeDto[], typeNodeId: string) => {

        const nodesRaw = search.category === NodeDataSearchParamsCategory.Node
            ? nodes.filter(node => compareTwoString(node.name, search.string))
            : nodes

        return nodesRaw.map(node => {
            return { value: `${node.id}_${typeNodeId}`, label: node.name }
        })
    }

    treeData.push({
        value: "Узлы данных",
        label: "Узлы данных",
        children: parseDomains(data.domains)
    })

    const treeDataFiltered = isHasChildren(treeData[0], 0, search.category)

    return (treeDataFiltered ? [{...treeDataFiltered}] : [{...treeData[0], children: []}])
}

function compareTwoString(str1: string, str2: string) {
    return str1.toLowerCase().startsWith(str2.toLowerCase())
}

function isHasChildren(treeItem: TreeItem, currentCategory: NodeDataSearchParamsCategory, searchCategory: NodeDataSearchParamsCategory): TreeItem | undefined {
    if (currentCategory === searchCategory - 1)
        return treeItem.children?.length ? treeItem : undefined

    const children = treeItem.children?.map(children => isHasChildren(children, currentCategory + 1, searchCategory))?.filter(children => !!children ) as (TreeItem[] | undefined);

    if (children?.length)
        return { ...treeItem, children}
    return undefined;
}

function parsePrimaryDataToTreeData(data: ProjectDataDto) {
    const treeData: TreeItem[] = [];
    treeData.push({
        value: "Первичные данные",
        label: "Первичные данные",
        children: data.primary.map(domain => {
            return {
                value: domain.domain,
                label: `Домен "${domain.domain}"`,
                children: domain.type_data.map(typeData => {
                    return {
                        value: typeData,
                        label: typeData
                    }
                })
            }
        })
    })
    return treeData;
}

export default DataTab;