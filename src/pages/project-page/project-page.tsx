import React from 'react';
import "./style.sass"
import {useQuery} from "@tanstack/react-query";
import {queryKeys, service} from "../../utils/api/service";
import {useParams, useSearchParams} from "react-router-dom";
import PageLayoutCmp from "../../components/page-layout-cmp/page-layout-cmp";
import LoaderCmp from "../../components/loader-cmp/loader-cmp";
import LoadProjectTab from "./load-tab";
import FilesTab from "./files-tab";
import DataTab from "./data-tab";

enum ProjectTab {
    Load = "load",
    Files = "files",
    Data = "data"
}

const ProjectTabItems = [
    { key: ProjectTab.Load, name: "Загрузка данных" },
    { key: ProjectTab.Files, name: "Файлы" },
    { key: ProjectTab.Data, name: "Загруженные данные" }
]

export const ProjectPage = () => {

    const {id: projectId} = useParams()
    const [params, setParams] = useSearchParams()

    const {data: projectFiles, isLoading} = useQuery({
        queryKey: queryKeys.projectFiles(projectId),
        queryFn: () => service.getProjectFiles(projectId || ""),
        select: ({data}) => data.files,
        enabled: !!projectId
    })

    const currentTab = params.get("t") as ProjectTab || ProjectTab.Load;

    const ProjectTabContent: Record<ProjectTab, React.ReactNode> = {
        [ProjectTab.Load]: <LoadProjectTab files={projectFiles}/>,
        [ProjectTab.Files]: <FilesTab/>,
        [ProjectTab.Data]: <DataTab/>,
    }

    return (
        <PageLayoutCmp>
            <div className="project-page">
                <div className={"project-page__header"}>
                    <h2>Project name</h2>
                    <h5>Загрузите данные для тестирования</h5>
                    <div className={"tabs"}>
                        {
                            ProjectTabItems?.map(tab =>
                                <div key={tab.key}
                                     className={`tabs__item ${tab.key === currentTab ? "tabs__item_selected" : null}`}
                                     onClick={() => setParams({t: tab.key})}
                                >
                                    {tab.name}
                                </div>)
                        }
                    </div>
                </div>
                <div className={"project-page__content"}>
                    { isLoading ? <LoaderCmp/> : ProjectTabContent[currentTab] || "Раздел не найден" }
                </div>
            </div>
        </PageLayoutCmp>
    )
}

