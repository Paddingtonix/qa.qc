import "./style.sass"
import {ReactNode, useState} from "react";
import {useOutsideClick} from "../../../utils/hooks/use-outside-click";

interface DropdownCmpProps {
    items?: { key: string, title: ReactNode, prefix?: ReactNode}[],
    defaultValue?: string,
    placeholder?: string,

    onSelect?(key: string): void
}

const DropdownCmp = (props: DropdownCmpProps) => {

    const {
        items,
        defaultValue,
        placeholder,
        onSelect
    } = props;

    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | undefined>(defaultValue);

    const ref = useOutsideClick(() => {
        setOpen(false);
    });

    const onChangeValue = (key: string) => {
        setSelectedItem(key);
        setOpen(false);
        onSelect && onSelect(key);
    }

    const getSelectedItem = () => {
        return items?.find(item => item.key === selectedItem)
    }

    return (
        <div className='dropdown' ref={ref}>
            <div className={`dropdown__input ${!getSelectedItem() && "dropdown__input_empty"}`} onClick={() => setOpen(!open)}>
                {getSelectedItem()?.prefix ? getSelectedItem()?.prefix : undefined}
                <span>{getSelectedItem()?.title || placeholder || "Выберите значение"}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className={`arrow ${open && 'arrow_up'}`}>
                    <path d="M3.51501 8.465L12 16.95L20.485 8.465L19.071 7.05L12 14.122L4.92901 7.05L3.51501 8.465Z"/>
                </svg>
            </div>
            <div
                className={!open ? "dropdown__items_closed" : "dropdown__items_opened"}>
                {
                    items?.length ?
                    items?.map((item) =>
                        <span
                            className={`item ${item.key === selectedItem && "item_selected"}`}
                            key={item.key}
                            onClick={() => onChangeValue(item.key)}
                        >
                            {item.prefix ? item.prefix : undefined}
                            <span>{item.title}</span>
                        </span>) : <div className={"dropdown__items_empty"}>Нет данных</div>
                }
            </div>
        </div>
    )
}

export default DropdownCmp;