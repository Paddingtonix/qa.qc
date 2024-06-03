import {instance} from "./api";

class Service {


    async getProjects() {
        return instance.get<{projects: ProjectDto[]}>(`/project/get`)
    }

    async getProjectFiles(projectId: string) {
        return instance.get<{files: ProjectFileDto[]}>(`/project/${projectId}/file/get`)
    }

    async getProjectTests(projectId: string) {
        return instance.get<{result: {message: string, tests: TestDto[]}}>(`/project/${projectId}/test/get`)
    }

    async getProjectNodes(projectId: string) {
        return instance.get<{nodes: NodeDto[]}>(`/project/${projectId}/node/get`)
    }

    async createProject(data: CreateProjectDto) {
        return instance.post(`/project/create`, data)
    }

    async uploadTestFile(data: UploadTestFileDto) {

        const formData = new FormData();
        formData.append("projectID", data.projectID);
        formData.append("file", data.file);

        return instance.post<{date: {errorNodes: string}}>(`/project/testUpload`, formData)
    }
    async login(data: LoginCredentials) {
        return instance.post<TokensResponse>(`/user/login`, data)
    }

    async refreshToken(refreshToken: string | null) {
        return instance.post<TokensResponse>(`/user/refresh`, {refreshToken})
    }

}

export const service = new Service();

export const queryKeys = {
    projects: () => ["PROJECTS"],
    projectFiles: (projectId?: string) => ["PROJECT_FILES", projectId],
    projectTests: (projectId?: string) => ["PROJECT_TESTS", projectId],
    projectNodes: (projectId?: string) => ["PROJECT_NODES", projectId],
    refreshToken: () => ["REFRESH_TOKEN"],
}

export type LoginCredentials = {
    email: string,
    password: string
}

export type TokensResponse = {
    token: string,
    refreshToken: string
}

export type UploadTestFileDto = {
    projectID: string,
    file: File
}

export type ProjectFileDto = {
    name: string,
    path: string,
    type: string
}

export type ProjectDto = {
    createdAt: string,
    id: string,
    name: string,
    updatedAt: string
}

export type CreateProjectDto = {
    name: string
}

export type NodeDto = {
    attributes: string[],
    category: string,
    domain: string,
    id: string,
    name: string
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