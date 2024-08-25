import "./style.sass"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateProjectDto, MemberDto, queryKeys, service} from "../../utils/api/service";
import PageLayoutCmp from "../../components/ui-components/page-layout-cmp/page-layout-cmp";
import {generatePath, Link, useSearchParams} from "react-router-dom";
import {RouterLinks} from "../../App";
import {useNotification} from "../../components/base/notification/notification-provider";
import React, {useState} from "react";
import TooltipCmp from "../../components/base/tooltip-cmp/tooltip-cmp";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";
import TabsCmp, {TabItem} from "../../components/base/tabs-cmp/tabs-cmp";
import {useAuth} from "../../utils/providers/AuthProvider";
import ProjectMembersCmp from "../../components/ui-components/project-members/ProjectMembersCmp";

enum ProjectAffiliation {
    Owned = "owned",
    Member = "member",
}

const ProjectAffiliationTabItems: TabItem[] = [
    { key: ProjectAffiliation.Owned, title: "Созданные мной" },
    { key: ProjectAffiliation.Member, title: "Принимаю участие" },
]

const ProjectsPage = () => {

    const [params, setParams] = useSearchParams()

    const {data: projects, isLoading} = useQuery({
        queryKey: queryKeys.projects(),
        queryFn: () => service.getProjects(),
        select: ({data}) => data
    })

    const currentTab = params.get("t") as ProjectAffiliation || ProjectAffiliation.Owned;

    const getProjects = () => {
        if (projects)
            return currentTab === ProjectAffiliation.Owned ? projects.owned_projects : projects.member_projects
        return [];
    }

    return (
        <PageLayoutCmp>
            <div className={"projects-page"}>
                <div className={"projects-page__header"}>
                    <div>
                        <h2>Проекты</h2>
                        { currentTab === ProjectAffiliation.Owned ? <CreateProjectButton/> : undefined }
                    </div>
                    <TabsCmp
                        items={ProjectAffiliationTabItems}
                        selectedTab={currentTab}
                        onSelect={(key) => setParams({t: key})}
                    />
                </div>
                <div className={"projects-page__projects-list"}>
                    {isLoading ? <LoaderCmp/> :
                        getProjects().length ? getProjects().map(project =>
                            <ProjectItem
                                id={project.project_id}
                                name={project.project_name}
                                members={project.project_members}
                                owner={project.project_owner}
                                key={project.project_id}
                            />
                        ) : <span className={"projects-page__empty-list-text"}>Список проектов пуст</span>}
                </div>
            </div>
        </PageLayoutCmp>

    )
}

interface ProjectItemProps {
    id: string,
    name: string,
    owner: MemberDto,
    members: MemberDto[]
}

const ProjectItem = ({id, name, members, owner}: ProjectItemProps) => {

    const {userId} = useAuth();
    const queryClient = useQueryClient();
    const {toastSuccess, toastError} = useNotification();

    const {mutate: deleteProject} = useMutation({
        mutationFn: () => service.deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.projects()})
            toastSuccess("Проект удалён")
        },
        onError: () => toastError("Ошибка")
    });

    const isOwner = () => {
        return owner.id === userId
    }

    return (
        <Link to={generatePath(RouterLinks.Project, {id})} className={"project-card"}>
            <div>
                <span>{name}</span>
                <ProjectMembersCmp projectId={id} members={members} owner={owner}/>
            </div>
            {
                isOwner() ?
                    <TooltipCmp text={"Удалить"} direction={"top"}>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                             className={"project-card__delete-button"}
                             onClick={(e) => {
                                 e.preventDefault();
                                 deleteProject();
                             }}
                        >
                            <path d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"/>
                        </svg>
                    </TooltipCmp> : undefined
            }
        </Link>
    )
}

const CreateProjectButton = () => {

    const queryClient = useQueryClient();
    const {toastSuccess} = useNotification();

    const [mode, setMode] = useState(false)
    const [name, setName] = useState("");

    const {mutateAsync: createProject} = useMutation({
        mutationFn: (data: CreateProjectDto) => service.createProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.projects()})
            toastSuccess("Проект создан")
        }
    });

    const onCreate = () => {
        if (!name) return;
        createProject({project_name: name.toUpperCase()}).then(() => {
            setMode(false);
            setName("");
        })
    }

    return (
        <div className={`projects-page__create-button-container`}>
            {
                mode ?
                    <div className={`projects-page__create-button projects-page__create-button_edit`}>
                        <input
                            type="text"
                            autoFocus={true}
                            value={name}
                            placeholder={"Введите название проекта"}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div> : <button className={`projects-page__create-button projects-page__create-button_normal`}
                                     onClick={() => setMode(true)}> Новый проект</button>
            }
            {
                mode &&
                <>
                    <TooltipCmp text={"Сохранить"} direction={"top"}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onCreate}>
                            <path d="M9.52495 17.657L4.57495 12.707L5.98895 11.293L9.52645 14.8265L9.52495 14.828L18.01 6.343L19.424 7.757L10.939 16.243L9.52595 17.656L9.52495 17.657Z" fill="#ffffff"/>
                        </svg>
                    </TooltipCmp>
                    <TooltipCmp text={"Отменить"} direction={"top"}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             onClick={() => setMode(false)}>
                            <path
                                d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"/>
                        </svg>
                    </TooltipCmp>
                </>
            }
        </div>
    )
}

export default ProjectsPage;