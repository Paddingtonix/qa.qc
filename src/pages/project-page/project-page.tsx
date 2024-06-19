import React, {useState} from 'react';
import "./style.sass"
import {useQuery} from "@tanstack/react-query";
import {queryKeys, service} from "../../utils/api/service";
import {useParams} from "react-router-dom";
import LayoutCmp from "../../components/layout-cmp/layout-cmp";
import LoaderCmp from "../../components/loader-cmp/loader-cmp";
import LoadProjectTab from "./load-tab";

enum ProjectTab {
    Load = "Load",
    Files = "Files",
    Data = "Data"
}

const ProjectTabItems = [
    { key: ProjectTab.Load, name: "Загрузка данных" },
    { key: ProjectTab.Files, name: "Файлы" },
    { key: ProjectTab.Data, name: "Загруженные данные" }
]

export const ProjectPage = () => {

    const {id: projectId} = useParams()
    const [selectedProjectTab, setSelectedProjectTab] = useState<ProjectTab>(ProjectTab.Load);

    const {data: projectFiles, isLoading} = useQuery({
        queryKey: queryKeys.projectFiles(projectId),
        queryFn: () => service.getProjectFiles(projectId || ""),
        select: ({data}) => data.files,
        enabled: !!projectId
    })

    const ProjectTabContent: Record<ProjectTab, React.ReactNode> = {
        [ProjectTab.Load]: <LoadProjectTab files={projectFiles}/>,
        [ProjectTab.Files]: <div/>,
        [ProjectTab.Data]: <div/>,
    }

    return (
        <LayoutCmp>
            <div className="project-page">
                <div className={"project-page__header"}>
                    <h2>Project name</h2>
                    <h5>Загрузите данные для тестирования</h5>
                    <div className={"tabs"}>
                        {
                            ProjectTabItems?.map(tab =>
                                <div key={tab.key}
                                     className={`tabs__item ${tab.key === selectedProjectTab ? "tabs__item_selected" : null}`}
                                     onClick={() => setSelectedProjectTab(tab.key)}
                                >
                                    {tab.name}
                                </div>)
                        }
                    </div>
                </div>
                <div className={"project-page__content"}>
                    { isLoading ? <LoaderCmp/> : ProjectTabContent[selectedProjectTab] }
                </div>
            </div>
        </LayoutCmp>
    )
}

