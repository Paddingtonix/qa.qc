import axios, {AxiosError, AxiosResponse} from "axios";
import {QueryClient, useMutation} from "@tanstack/react-query";
import {useAuth} from "../providers/AuthProvider";
import {getAccessToken, getRefreshToken} from "../helpers/local-storage";
import {useNotification} from "../../components/base/notification/notification-provider";
import {service} from "./service";

export const instance = axios.create({
    baseURL: `https://qa-qc-api.freydin.space/api/v1`,
    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
});

export function setAuthHeaderToInstance(accessToken: string): void {
    instance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

export const useInstanceInterceptors = () => {

    const { signOut } = useAuth();
    const {toastError} = useNotification();

    const {mutate: refreshToken } = useMutation({
        mutationFn: () => service.refreshToken(getRefreshToken()),
        onError: () => {
            signOut();
        }
    })

    const onResponse = (response: AxiosResponse): AxiosResponse => {
        return response;
    }

    const onResponseError = (error: AxiosError): Promise<AxiosError> => {
        onUnauthorizedError(error);
        onInternalServerError(error);
        return Promise.reject(error);
    }

    const onUnauthorizedError = (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (getAccessToken() && getRefreshToken()) refreshToken()
            else signOut();
        }
    }

    const onInternalServerError = (error: AxiosError) => {
        if (error.response?.status === 500 || error.response?.status === 502) {
            toastError("Упс, что-то пошло не так, попробуйте позже")
        }
    }

    instance.interceptors.response.use(onResponse, onResponseError);
}

