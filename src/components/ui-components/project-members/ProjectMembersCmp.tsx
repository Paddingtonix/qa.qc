import "./style.sass"
import TooltipCmp from "../../base/tooltip-cmp/tooltip-cmp";
import BadgeCmp from "../../base/badge/badge-cmp";
import React, {useState} from "react";
import {MemberDto, queryKeys, service, UserDto} from "../../../utils/api/service";
import {useNotification} from "../../base/notification/notification-provider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "../../../utils/providers/AuthProvider";
import {useOutsideClick} from "../../../utils/hooks/use-outside-click";
import LoaderCmp from "../../base/loader-cmp/loader-cmp";

interface Props {
    projectId: string,
    members: MemberDto[],
    owner: MemberDto,
    enableEdit?: boolean
}

const ProjectMembersCmp = ({members, projectId, owner, enableEdit = false}: Props) => {

    const {userId} = useAuth();
    const queryClient = useQueryClient();
    const {toastSuccess, toastError} = useNotification();

    const {mutate: removeMember} = useMutation({
        mutationFn: (userId: string) => service.removeProjectMember(projectId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.project(projectId)})
            toastSuccess("Пользователь исключён")
        },
        onError: () => toastError("Ошибка")
    });

    const isOwner = () => {
        return owner.id === userId && enableEdit
    }

    return (
        <div className={"project-members"}>
            <span>Участники:</span>
            <div className={"project-members__list"}>
                {
                    members.map(member =>
                        member.id === owner.id ?
                            <TooltipCmp direction={"top"} text={"Владелец проекта"} key={member.id}>
                                <BadgeCmp type={"primary"}>{member.name}</BadgeCmp>
                            </TooltipCmp>
                            : <BadgeCmp key={member.id} type={"default"} className={"project-members__unit"}>
                                {member.name}
                                <TooltipCmp direction={"top"} text={"Исключить"}>
                                    <svg
                                        width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeMember(member.id);
                                        }}
                                    >
                                        <path d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"/>
                                    </svg>
                                </TooltipCmp>
                            </BadgeCmp>)
                }
                { isOwner() ? <AddMemberButton projectId={projectId} members={members}/> : undefined }
            </div>
        </div>
    )
}

interface AddMemberButtonProps {
    projectId: string,
    members: MemberDto[]
}

const AddMemberButton = ({projectId, members}: AddMemberButtonProps) => {

    const queryClient = useQueryClient();
    const {toastSuccess, toastError} = useNotification();
    const [searchUser, setSearchUser] = useState("")

    const [isOpen, setIsOpen] = useState(false);
    const ref = useOutsideClick(() => {
        setIsOpen(false);
    });

    const {data: users, isLoading} = useQuery({
        queryKey: queryKeys.users({
            name: searchUser
        }),
        queryFn: () => service.getUsers({
            name: searchUser
        }),
        select: ({data}) => data.users
    })

    const {mutate: addMember} = useMutation({
        mutationFn: (userId: string) => service.addProjectMember(projectId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.project(projectId)})
            toastSuccess("Пользователь добавлен")
        },
        onError: () => toastError("Ошибка")
    });

    const getUsersList = (): UserDto[] => {
        return users?.filter(user => !members.find(member => member.id === user.id)) || []
    }

    return (
        <div className={"project-members__add-member-btn"} ref={ref}>
            <BadgeCmp
                type={"ghost"}
                onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                }}
            >+ Добавить</BadgeCmp>
            {
                isOpen ?
                    <div onClick={(e) => e.preventDefault()}>
                        <input
                            placeholder={"Введите имя пользователя"}
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                        {
                            isLoading ? <LoaderCmp size={"small"}/> :
                                <ul>
                                    {
                                        getUsersList().length ?
                                        users?.filter(user => !members
                                            .find(member => member.id === user.id))
                                            .map(user =>
                                                <li key={user.id}>
                                                    <div>
                                                        <span>{user.name}</span>
                                                        <span>{user.email}</span>
                                                    </div>
                                                    <BadgeCmp
                                                        type={"primary"}
                                                        onClick={() => addMember(user.id)}
                                                    >Добавить</BadgeCmp>
                                                </li>
                                            ) : "Пользователи не найдены"
                                    }
                                </ul>
                        }
                    </div> : undefined
            }
        </div>
    )
}

export default ProjectMembersCmp