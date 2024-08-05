import {instance} from "./api";

class Service {

    async getProjects() {
        return instance.get<UserProjectsDto>(`/project/get`)
    }

    async getProject(projectId: string) {
        return instance.get<ProjectDto>(`/project/${projectId}/get`)
    }

    async getProjectCategories(projectId: string) {
        return instance.get<{ categories: CategoryDto[] }>(`/project/${projectId}/categories/get/`)
    }

    async getProjectFiles(projectId: string) {
        return instance.get<{ files: ProjectFileDto[] }>(`/project/${projectId}/file/get/all/`)
    }

    async getProjectTests(projectId: string) {
        return instance.get<{ result: { message: string, tests: TestDto[] } }>(`/project/${projectId}/test/get/`)
    }

    async createProject(data: CreateProjectDto) {
        return instance.post(`/project/create_project/`, data)
    }

    async deleteProject(projectId: string) {
        return instance.delete(`/project/${projectId}/delete/`)
    }

    async addProjectMember(projectId: string, userId: string) {
        return instance.post(`/project/${projectId}/member/add/`, {}, {
            params: {user_data: userId}
        })
    }

    async removeProjectMember(projectId: string, userId: string) {
        return instance.delete(`/project/${projectId}/member/remove/`, {
            params: {user_data: userId}
        })
    }

    async editProjectName(id: string, data: EditProjectNameDto) {
        return instance.put(`/project/${id}/edit/`, data)
    }

    async getProjectData(projectId: string) {
        return instance.get<ProjectDataDto>(`/project/${projectId}/available_data/get/`)
    }

    async getDomainData(projectId: string, domain: string) {
        return instance.get<DomainDataDto>(`/project/${projectId}/node_types_sharded/get/`, {
            params: {domain_name: domain}
        })
    }

    async getTypeNodeData(projectId: string, typeNodeId: string) {
        return instance.get<TypeNodeDataDto>(`/project/${projectId}/nodes_sharded/get/`, {
            params: {type_id: typeNodeId}
        })
    }

    async getNodeData(projectId: string, typeNodeId: string, nodeId: string) {
        return instance.get<NodeDataDto>(`/project/${projectId}/node_sharded/get/`, {
            params: {type_id: typeNodeId, node_id: nodeId}
        })
    }

    async getPrimary(projectId: string, typeData: string) {
        return instance.get<any[]>(`/project/${projectId}/primary/get/`, {
            params: {type_data: typeData}
        })
    }

    async uploadTestFile(data: UploadTestFileDto) {

        const formData = new FormData();
        data.files.forEach(file => formData.append("files", file))

        return instance.post<{ date: { errorNodes: string } }>(`/project/${data.projectID}/file/upload/`, formData, {
            params: {category: data.category}
        })
    }

    async getProfile() {
        return instance.get<UserDto>(`/user/me/`)
    }

    async getUsers(params?: GetUsersParams) {
        return instance.get<UserListDto>(`/user/get/all`, {params})
    }

    async login(data: LoginCredentials) {
        return instance.post<TokensResponse>(`/user/login/`, data)
    }

    async register(data: RegisterCredentials) {
        return instance.post<TokensResponse>(`/user/register/`, data)
    }

    async refreshToken(refreshToken: string | null) {
        return instance.post<TokensResponse>(`/user/token_refresh/`, {refresh_token: refreshToken})
    }

}

export const service = new Service();

export const queryKeys = {
    userProfile: () => ["USER_PROFILE"],
    users: (params?: GetUsersParams) => ["USERS", params],
    projects: () => ["PROJECTS"],
    project: (projectId?: string) => ["PROJECT", projectId],
    projectFiles: (projectId?: string) => ["PROJECT_FILES", projectId],
    projectData: (projectId?: string) => ["PROJECT_DATA", projectId],
    nodeData: (projectId?: string, typeNode?: string, nodeId?: string) => ["NODE_DATA", projectId, typeNode, nodeId],
    domainData: (projectId?: string, domain?: string) => ["DOMAIN_DATA", projectId, domain],
    typeNodeData: (projectId?: string, typeNode?: string) => ["TYPE_MODE_DATA", projectId, typeNode],
    projectPrimary: (projectId?: string, typeData?: string) => ["PROJECT_PRIMARY", projectId, typeData],
    projectCategories: (projectId?: string) => ["PROJECT_CATEGORIES", projectId],
    projectTests: (projectId?: string) => ["PROJECT_TESTS", projectId],
    refreshToken: () => ["REFRESH_TOKEN"]
}

export type GetUsersParams = {
    skip?: number,
    limit?: number,
    name?: string,
    email?: string
}

export type UserListDto = {
    users: UserDto[],
    total: number,
    skip: number,
    limit: number
}

export type LoginCredentials = {
    email: string,
    password: string
}

export type RegisterCredentials = {
    name: string,
    email: string,
    password: string
}

export type TokensResponse = {
    auth_token: string,
    refresh_token: string
}

export type EditProjectNameDto = {
    new_project_name?: string
}

export type UploadTestFileDto = {
    projectID: string,
    files: File[],
    category: string
}

export type UserProjectsDto = {
    owned_projects: ProjectDto[],
    member_projects: ProjectDto[]
}

export type ProjectFileDto = {
    file_id: string,
    filename: string,
    category: string
}

export type ProjectDto = {
    project_id: string,
    project_name: string,
    project_owner: MemberDto,
    project_members: MemberDto[],
}

export type MemberDto = {
    id: string,
    name: string
}

export type UserDto = {
    id: string,
    name: string,
    email: string
}

export type CreateProjectDto = {
    project_name: string
}

export type CategoryDto = {
    name: string,
    domain: string[],
    description: string,
    extensions_files: string[]
}

export type NodeDataDto = {
    _id: string,
    name: string,
    type_node: string,
    node_data: Array<number | undefined>,
    values_attributes: {
        WELL: string,
        Фации: string,
        Глубина: Array<number | undefined>
    }
}

export type DomainDataDto = {
    name: string,
    type_nodes_list: {
        id: string,
        type_name: string
    }[]
}

export type TypeNodeDataDto = {
    id: string,
    type_name: string,
    node_list: {
        id: string,
        name: string
    }[]
}

export type ProjectDataDto = {
    domains: {
        type_nodes_list: {
            id: string,
            name: string,
            nodes: {
                id: string,
                name: string
            }[]
        }[],
        name: string
    }[],
    primary: {
        type_data: string[],
        domain: string
    }[]
}

export type TestDto = {
    nodes: {
        id: string,
        name: string,
        values_attributes: any[]
    }[],
    test: {
        test_id: string,
        test_name: string
    },
    test_order: number
}