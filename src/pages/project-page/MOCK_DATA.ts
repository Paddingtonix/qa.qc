import {TreeItem} from "../../components/tree/Tree";

export const MockDataFiles: TreeItem[] = [
    {
        value: "Категория “Данные ГИС”",
        label: "Категория “Данные ГИС”",
        children: [
            { value: "1", label: "Lorem_ipsum_dolor_sit_amet_adipiscing.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    },
    {
        value: "Категория “Данные добычи”",
        label: "Категория “Данные добычи”",
        children: [
            { value: "1", label: "x1.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    },
    {
        value: "Категория “Мнемоники GIS”",
        label: "Категория “Мнемоники GIS”",
        children: [
            { value: "1", label: "x1.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    },
    {
        value: "Категория “Мнемоники Core”",
        label: "Категория “Мнемоники Core”",
        children: [
            { value: "1", label: "x1.las"},
            { value: "2", label: "x2.las"},
            { value: "3", label: "x3.las"}
        ]
    }
]

export const MockDataData: TreeItem[] = [
    {
        value: "Узлы данных",
        label: "Узлы данных",
        children: [
            {
                value: "Домен “Керн”",
                label: "Домен “Керн”",
                children: [
                    {
                        value: "Тип узла (Кп_абс)",
                        label: "Тип узла (Кп_абс)",
                        children: [
                            {value: "Кп_абс/CORE (well: 888)", label: "Кп_абс/CORE (well: x1)"}
                        ]
                    }
                ]
            },
            {
                value: "Домен “WELLS”",
                label: "Домен “WELLS”",
                children: [
                    {
                        value: "Тип узла (OPR)",
                        label: "Тип узла (OPR)",
                        children: [
                            {value: "Кп_абс/CORE (well: x77)", label: "Кп_абс/CORE (well: x1)"},
                            {value: "Кп_абс/CORE (well: x2)", label: "Кп_абс/CORE (well: x1)"},
                            {value: "Кп_абс/CORE (well: x3)", label: "Кп_абс/CORE (well: x1)"},
                            {value: "Кп_абс/CORE (well: x5)", label: "Кп_абс/CORE (well: x1)"}
                        ]
                    }
                ]
            },
        ]
    },
    {
        value: "Вспомогательные данные",
        label: "Вспомогательные данные",
        children: [
            {
                value: "Домен “Керн”",
                label: "Домен “Керн”",
                children: [
                    {
                        value: "Тип узла (Кп_абс)",
                        label: "Тип узла (Кп_абс)",
                        children: [
                            {value: "Кп_абс/CORE (well: x1)", label: "Кп_абс/CORE (well: x1)"}
                        ]
                    }
                ]
            },
        ]
    }
]