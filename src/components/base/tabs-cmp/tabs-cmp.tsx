import "./style.sass"
import React, {useEffect, useState} from "react";

interface Props {
    items?: TabItem[],
    selectedTab?: string,
    borderAlign?: "bottom" | "top",
    onSelect?(key: string): void
}

export type TabItem = {
    key: string,
    title: string,
}

const TabsCmp = (props: Props) => {

    const {
        items,
        selectedTab: initialSelectedTab,
        borderAlign = "bottom",
        onSelect
    } = props;

    const [selected, setSelected] = useState<string | undefined>(initialSelectedTab || undefined);

    useEffect(() => {
        setSelected(initialSelectedTab)
    }, [initialSelectedTab])

    const onClickTab = (key: string) => {
        onSelect && onSelect(key)
        setSelected(key)
    }

    return (
        <div className={`tabs-cmp tabs-cmp_${borderAlign}`}>
            {
                items?.map(tab =>
                    <div key={tab.key}
                         className={`tabs-cmp__item ${tab.key === selected ? "tabs-cmp__item_selected" : null}`}
                         onClick={() => onClickTab(tab.key)}
                    >
                        {tab.title}
                    </div>)
            }
        </div>
    )
}

export default TabsCmp