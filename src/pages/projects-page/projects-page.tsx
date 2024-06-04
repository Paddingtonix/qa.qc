import "./style.sass"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateProjectDto, queryKeys, service} from "../../utils/service";
import LayoutCmp from "../../components/layout-cmp/layout-cmp";
import {generatePath, Link} from "react-router-dom";
import {Links} from "../../App";
import {useNotification} from "../../components/base/notification/notification-provider";
import {useState} from "react";
import TooltipCmp from "../../components/tooltip-cmp/tooltip-cmp";
import LoaderCmp from "../../components/loader-cmp/loader-cmp";

const ProjectsPage = () => {

    const {data: projects, isLoading} = useQuery({
        queryKey: queryKeys.projects(),
        queryFn: () => service.getProjects(),
        select: ({data}) => data.projects
    })

    return (
        <LayoutCmp>
            <div className={"projects-page"}>
                <div>
                    <h2>Проекты</h2>
                    <div className={"projects-page__projects-list"}>
                        { isLoading ? <LoaderCmp/> :
                            <>
                                <CreateProjectButton/>
                                {
                                    projects?.map(project =>
                                        <Link to={generatePath(Links.Project, {id: project.id})}
                                              className={"projects-page__project-card"} key={project.id}>
                                            {project.name}
                                        </Link>
                                    )
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </LayoutCmp>

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
        createProject({name}).then(() => {
            setMode(false);
            setName("");
        })
    }

    return (
        mode
            ? <div className={`projects-page__create-button projects-page__create-button_edit`}>
                <input
                    type="text"
                    autoFocus={true}
                    value={name}
                    placeholder={"Введите название проекта"}
                    onChange={(event) => setName(event.target.value)}
                />
                <TooltipCmp text={"Сохранить"} direction={"top"}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onCreate}>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"/>
                    </svg>
                </TooltipCmp>
                <TooltipCmp text={"Отменить"} direction={"top"}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         onClick={() => setMode(false)}>
                        <path
                            d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"/>
                    </svg>
                </TooltipCmp>
            </div>
            : <button className={`projects-page__create-button projects-page__create-button_normal`}
                      onClick={() => setMode(true)}> Новый проект</button>
    )
}

export default ProjectsPage;