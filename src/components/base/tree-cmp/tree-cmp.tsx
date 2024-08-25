import React, {useCallback, useEffect, useState} from "react";
import "./style.sass"

interface TreeProps {
    items?: TreeItem[],
    selectedValue?: string,
    className?: string,
    onSelect?(value: string, deep: number): void
}

export interface TreeItem {
    value: string,
    label?: string,
    children?: TreeItem[]
}

const TreeCmp = (props: TreeProps) => {

    const {
        items,
        selectedValue: initialSelectedValue,
        className,
        onSelect
    } = props;
    const [selectedValue, setSelectedValue] = useState<undefined | string>(initialSelectedValue || undefined);

    useEffect(() => {
        setSelectedValue(initialSelectedValue)
    }, [initialSelectedValue])

    const selectValue = useCallback((value: string, deep: number) => {
        onSelect
            ? onSelect(value, deep)
            : setSelectedValue(value);
    }, [selectedValue])

    const isSelectedValue = useCallback((value: string) => {
        return selectedValue === value
    }, [selectedValue])


    return (
        <div className={`tree-cmp ${className}`}>
            <ul>
                {
                    items?.length ? items?.map(item =>
                        <TreeItem
                            key={item.value}
                            {...item}
                            selectValue={selectValue}
                            isSelectedValue={isSelectedValue}
                            depth={0}
                        />) : <span>Нет данных</span>
                }
            </ul>
        </div>

    )
};

interface TreeItemProps extends TreeItem {
    depth: number,
    selectValue(value: string, deep: number): void,
    isSelectedValue(value: string): boolean,
}

const TreeItem = (props: TreeItemProps) => {

    const {
        value,
        label,
        children,
        depth,
        selectValue,
        isSelectedValue
    } = props;

    const onSelect = () => {
        selectValue(value, depth)
    }

    const [open, setOpen] = useState(false);

    return (
        <li className={`tree-item ${open && "tree-item_open"} ${isSelectedValue(value) && "tree-item_selected"}`}>
            <div>
                {
                    (children?.length) ?
                        <svg onClick={() => setOpen(!open)} width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.51501 8.465L12 16.95L20.485 8.465L19.071 7.05L12 14.122L4.92901 7.05L3.51501 8.465Z"/>
                        </svg> : undefined
                }
                <span onClick={onSelect}>{ label }</span>
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