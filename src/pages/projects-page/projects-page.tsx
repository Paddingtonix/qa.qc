import "./style.sass"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateProjectDto, queryKeys, service} from "../../utils/api/service";
import PageLayoutCmp from "../../components/ui-components/page-layout-cmp/page-layout-cmp";
import {generatePath, Link} from "react-router-dom";
import {RouterLinks} from "../../App";
import {useNotification} from "../../components/base/notification/notification-provider";
import {useState} from "react";
import TooltipCmp from "../../components/base/tooltip-cmp/tooltip-cmp";
import LoaderCmp from "../../components/base/loader-cmp/loader-cmp";

const ProjectsPage = () => {

    const {data: projects, isLoading} = useQuery({
        queryKey: queryKeys.projects(),
        queryFn: () => service.getProjects(),
        select: ({data}) => data
    })

    return (
        <PageLayoutCmp>
            <div className={"projects-page"}>
                <div>
                    <h2>Проекты</h2>
                    <div>
                        <CreateProjectButton/>
                    </div>
                    <div className={"projects-page__projects-list"}>
                        {isLoading ? <LoaderCmp/> :
                            projects?.owned_projects.map(project =>
                                <Link to={generatePath(RouterLinks.Project, {id: project.project_id})}
                                      className={"project-card"} key={project.project_id}>
                                    <span>{project.project_name}</span>
                                    <TooltipCmp text={"Удалить"} direction={"top"}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                             className={"project-card__delete-button"}
                                        >
                                            <path
                                                d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"/>
                                        </svg>
                                    </TooltipCmp>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </PageLayoutCmp>

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
        createProject({project_name: name}).then(() => {
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