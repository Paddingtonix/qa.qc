import "./style.sass"
import React, {useEffect, useState} from "react";

interface Props {
    items?: TabItem[],
    selectedTab?: string,
    onSelect?(key: string): void
}

export type TabItem = {
    key: string,
    title: string
}

const TabsCmp = ({items, selectedTab: initialSelectedTab, onSelect}: Props) => {

    const [selected, setSelected] = useState<string | undefined>(initialSelectedTab || undefined);

    useEffect(() => {
        setSelected(initialSelectedTab)
    }, [initialSelectedTab])

    const onClickTab = (key: string) => {
        onSelect && onSelect(key)
        setSelected(key)
    }

    return (
        <div className={"tabs-cmp"}>
            {
                items?.map(tab =>
                    <div key={tab.key}
                         className={`tabs__item ${tab.key === selected ? "tabs__item_selected" : null}`}
                         onClick={() => onClickTab(tab.key)}
                    >
                        {tab.title}
                    </div>)
            }
        </div>
    )
}

export default TabsCmp