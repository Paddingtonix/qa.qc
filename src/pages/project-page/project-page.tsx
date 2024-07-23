import React, {useState} from 'react';
import "./style.sass"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {EditProjectNameDto, queryKeys, service} from "../../utils/api/service";
import {useParams, useSearchParams} from "react-router-dom";
import LoadProjectTab from "./load-tab";
import FilesTab from "./files-tab";
import DataTab from "./data-tab";
import PageLayoutCmp from "../../components/ui-components/page-layout-cmp/page-layout-cmp";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";
import TabsCmp, {TabItem} from "../../components/base/tabs-cmp/tabs-cmp";
import ProjectMembersCmp from "../../components/ui-components/project-members/ProjectMembersCmp";
import {useNotification} from "../../components/base/notification/notification-provider";
import {AxiosError} from "axios";
import TooltipCmp from "../../components/base/tooltip-cmp/tooltip-cmp";

enum ProjectTab {
    Load = "load",
    Files = "files",
    Data = "data"
}

const ProjectTabItems: TabItem[] = [
    { key: ProjectTab.Load, title: "Загрузка данных" },
    { key: ProjectTab.Files, title: "Файлы" },
    { key: ProjectTab.Data, title: "Загруженные данные" }
]

export const ProjectPage = () => {

    const {id: projectId} = useParams()
    const [params, setParams] = useSearchParams()

    const {data: project, isLoading: loadingProject} = useQuery({
        queryKey: queryKeys.project(projectId),
        queryFn: () => service.getProject(projectId || ""),
        select: ({data}) => data,
        enabled: !!projectId
    })

    const {data: projectFiles, isLoading} = useQuery({
        queryKey: queryKeys.projectFiles(projectId),
        queryFn: () => service.getProjectFiles(projectId || ""),
        select: ({data}) => data.files,
        enabled: !!projectId
    })

    const {data: projectCategories, isLoading: loadingCategories} = useQuery({
        queryKey: queryKeys.projectCategories(projectId),
        queryFn: () => service.getProjectCategories(projectId || ""),
        select: ({data}) => data.categories,
        enabled: !!projectId
    })

    const {data: projectData} = useQuery({
        queryKey: queryKeys.projectData(projectId),
        queryFn: () => service.getProjectData(projectId || ""),
        select: ({data}) => data,
        enabled: !!projectId
    })

    // const {data: projectDomains} = useQuery({
    //     queryKey: queryKeys.projectDomains(projectId),
    //     queryFn: () => service.getDomains(projectId || ""),
    //     select: ({data}) => data,
    //     enabled: !!projectId
    // })

    const currentTab = params.get("t") as ProjectTab || ProjectTab.Load;

    const ProjectTabContent: Record<ProjectTab, React.ReactNode> = {
        [ProjectTab.Load]: <LoadProjectTab files={projectFiles} categories={projectCategories}/>,
        [ProjectTab.Files]: <FilesTab files={projectFiles} categories={projectCategories}/>,
        [ProjectTab.Data]: <DataTab data={projectData}/>,
    }

    return (
        <PageLayoutCmp>
            <div className="project-page">
                {
                    (loadingProject || !project) ? <LoaderCmp/> :
                        <div className={"project-page__header"}>
                            <EditProjectName name={project.project_name} projectId={project.project_id}/>
                            <ProjectMembersCmp
                                members={project.project_members}
                                projectId={project.project_id}
                                owner={project.project_owner}
                                enableEdit={true}
                            />
                            <TabsCmp
                                items={ProjectTabItems}
                                selectedTab={currentTab}
                                onSelect={(key) => setParams({t: key})}
                            />
                        </div>
                }
                <div className={"project-page__content"}>
                    { isLoading || loadingCategories ? <LoaderCmp/> : ProjectTabContent[currentTab] || "Раздел не найден" }
                </div>
            </div>
        </PageLayoutCmp>
    )
}

interface EditProjectNameProps {
    projectId: string,
    name: string
}

const EditProjectName = ({name, projectId}: EditProjectNameProps) => {

    const [isEdit, setEdit] = useState(false);
    const [value, setValue] = useState(name);

    const queryClient = useQueryClient();
    const {toastSuccess, toastError} = useNotification();

    const {mutate: editProject} = useMutation({
        mutationFn: (data: EditProjectNameDto) => service.editProjectName(projectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.project(projectId)})
            toastSuccess("Название сохранено")
        },
        onError: (error: AxiosError) => {
            error.response?.status === 400 && toastError("Название проекта уже занято")
            error.response?.status === 422 && toastError("Название проекта должно состоять только из символов латиницы, цифр и нижнего подчеркивания")
        }
    });

    const onBlur = () => {
        setEdit(false)
        if (value.toUpperCase() !== name.toUpperCase())
            editProject({new_project_name: value})
    }

    return (
        <div className={"edit-project-name-cmp"}>
            {
                isEdit
                    ? <input
                        value={value}
                        onBlur={onBlur}
                        autoFocus={true}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    : <TooltipCmp direction={"top"} text={"Нажмите, чтобы редактировать"}><h6
                        onClick={(e) => {
                            e.preventDefault()
                            setEdit(true)
                        }}
                    >{name}</h6></TooltipCmp>
            }
        </div>
    )
}

