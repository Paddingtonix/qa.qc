import {instance} from "./api";

class Service {

    async getProjects() {
        return instance.get<UserProjectsDto>(`/project/get`)
    }

    async getProject(projectId: string) {
        return instance.get<ProjectDto>(`/project/${projectId}/get`)
    }

    async getProjectCategories(projectId: string) {
        return instance.get<{categories: CategoryDto[]}>(`/project/${projectId}/categories/get/`)
    }

    async getProjectFiles(projectId: string) {
        return instance.get<{files: ProjectFileDto[]}>(`/project/${projectId}/file/get/all/`)
    }

    async getProjectTests(projectId: string) {
        return instance.get<{result: {message: string, tests: TestDto[]}}>(`/project/${projectId}/test/get/`)
    }

    async getProjectNodes(projectId: string) {
        return instance.get<{nodes: NodeDto[]}>(`/project/${projectId}/node/get/`)
    }

    async createProject(data: CreateProjectDto) {
        return instance.post(`/project/create_project/`, data)
    }

    async deleteProject(projectId: string) {
        return instance.delete(`/project/${projectId}/delete/`)
    }

    async addProjectMember(projectId: string, userId: string) {
        return instance.post(`/project/${projectId}/member/add/`, {},{
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

    async getDomains(projectId: string) {
        return instance.get(`/project/${projectId}/domains/get/`)
    }

    async getNodes(projectId: string, typeNodeId: string) {
        return instance.get<any[]>(`/project/${projectId}/nodes/get/`, {
            params: {type_node_id: typeNodeId}
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

        return instance.post<{date: {errorNodes: string}}>(`/project/${data.projectID}/file/upload/`, formData, {
            params: { category: data.category }
        })
    }

    async getProfile(){
        return instance.get<UserDto>(`/user/me/`)
    }

    async getUsers(params?: GetUsersParams){
        return instance.get<UserListDto>(`/user/get/all`, { params })
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
    projectDomains: (projectId?: string) => ["PROJECT_DOMAINS", projectId],
    projectNodes: (projectId?: string, nodeId?: string) => ["PROJECT_NODES", projectId, nodeId],
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

export type NodeDto = {
    attributes: string[],
    category: string,
    domain: string,
    id: string,
    name: string
}

export type ProjectDataDto = {
    nodes: {
        type_node: {
            id: string,
            value: string
        }[],
        domain: string
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