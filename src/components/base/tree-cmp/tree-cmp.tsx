import React, {useCallback, useEffect, useState} from "react";
import "./style.sass"

interface TreeProps {
    items?: TreeItem[],
    maxDepth?: number,
    selectedValue?: string,
    onSelect?(value: string): void
}

export interface TreeItem {
    value: string,
    label?: string,
    children?: TreeItem[]
}

const TreeCmp = (props: TreeProps) => {

    const {
        items,
        maxDepth,
        selectedValue: initialSelectedValue,
        onSelect
    } = props;
    const [selectedValue, setSelectedValue] = useState<undefined | string>(initialSelectedValue || undefined);

    useEffect(() => {
        setSelectedValue(initialSelectedValue)
    }, [initialSelectedValue])

    const selectValue = useCallback((value: string) => {
        onSelect && onSelect(value !== selectedValue ? value : "");
        setSelectedValue(value !== selectedValue ? value : "");
    }, [selectedValue])

    const isSelectedValue = useCallback((value: string) => {
        return selectedValue === value
    }, [selectedValue])


    return (
        <div className={"tree-cmp"}>
            <ul>
                {
                    items?.map(item =>
                        <TreeItem
                            key={item.value}
                            {...item}
                            selectValue={selectValue}
                            isSelectedValue={isSelectedValue}
                            depth={0}
                            maxDepth={maxDepth}
                        />)
                }
            </ul>
        </div>

    )
};

interface TreeItemProps extends TreeItem {
    depth: number,
    maxDepth?: number,
    selectValue(value: string): void,
    isSelectedValue(value: string): boolean,
}

const TreeItem = (props: TreeItemProps) => {

    const {
        value,
        label,
        children,
        depth,
        maxDepth,
        selectValue,
        isSelectedValue
    } = props;

    const onSelect = () => {
        ((maxDepth && depth < maxDepth) || children?.length)
            ? setOpen(!open)
            : selectValue(value)
    }

    const [open, setOpen] = useState(false);

    return (
        <li className={`tree-item ${open && "tree-item_open"} ${!((maxDepth && depth < maxDepth) || children?.length) && "tree-item_ended"} ${isSelectedValue(value) && "tree-item_selected"}`}>
            <div onClick={onSelect}>
                <span>{ label }</span>
                {
                    ((maxDepth && depth < maxDepth) || children?.length) ?
                        <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.51501 8.465L12 16.95L20.485 8.465L19.071 7.05L12 14.122L4.92901 7.05L3.51501 8.465Z"/>
                        </svg> : undefined
                }
            </div>
            {
                (children && open) &&
                <ul>
                    {children.length ? children?.map(child =>
                        <TreeItem
                            key={child.value}
                            {...child}
                            selectValue={selectValue}
                            isSelectedValue={isSelectedValue}
                            depth={depth + 1}
                        />) : "Нет данных"}
                </ul>
            }
        </li>
    )
}

export default TreeCmp;