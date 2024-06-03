export type Node = {
    id: number,
    label: string,
    type: string,
    "class": string,
    group: string
}

export type Edge = {
    from: number,
    to: number,
    id: null | number,
    arrows: string,
    tests: string[]
}

export type FilterType = { name: string, code: string }[];

export type GraphData = { nodes: Node[], edges: Edge[] };

type DataItem = {
    [key: string]: string;
}

export type GraphTable = {
    columns: Array<{
        accessorKey: string,
        header: string
    }>,
    data: Array<DataItem>
}