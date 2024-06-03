import React, {createContext, useContext, useState} from "react";
import {setAuthHeaderToInstance} from "./api";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getAccessToken, getRefreshToken, getSessionToken,
    removeAccessToken,
    removeRefreshToken, removeSessionToken,
    setAccessToken,
    setRefreshToken,
    setSessionToken
} from "./local-storage";
import {queryKeys, service} from "./service";

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [isAuth, setIsAuth] = useState<boolean>(!!getAccessToken());
    const queryClient = useQueryClient();

    useRefreshToken(isAuth);

    const signIn = (accessToken: string, refreshToken: string, rememberMe: boolean) => {
        setAccessToken(accessToken);
        if (rememberMe) setRefreshToken(refreshToken);
        else {
            removeRefreshToken();
            setSessionToken(refreshToken);
        }
        setAuthHeaderToInstance(accessToken);
        setIsAuth(true);
        queryClient.clear();
    }

    const signOut = () => {

        const removeCache = () => {
            removeAccessToken();
            removeSessionToken();
            removeRefreshToken();
            queryClient.clear();
        }

        setIsAuth(false);
        removeCache();
    }

    const value: AuthContextValue = {
        isAuth,
        signIn,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

interface AuthContextValue {
    isAuth: boolean;
    signIn(accessToken: string, refreshToken: string, rememberMe: boolean): void;
    signOut(): void;
}

const AuthContext = createContext<AuthContextValue>({
    isAuth: false,
    signIn(_accessToken: string, _refreshToken: string, _rememberMe: boolean) {},
    signOut() {}
});

export const useAuth = () => {
    return useContext(AuthContext);
}

const REFRESH_TOKEN_INTERVAL = 4 * 60 * 1000;
export const useRefreshToken = (isAuth: boolean) => {

    const {data, isSuccess} = useQuery({
        queryKey: queryKeys.refreshToken(),
        queryFn: () => service.refreshToken(getRefreshToken() || getSessionToken()),
        select: ({data}) => data,
        enabled: isAuth && (!!getRefreshToken() || !!getSessionToken()),
        refetchInterval: REFRESH_TOKEN_INTERVAL,
        refetchIntervalInBackground: true,
    })

    if (isSuccess) {
        if (data) {
            setAuthHeaderToInstance(data.token);
            setAccessToken(data.token);

            if (!!getRefreshToken()) setRefreshToken(data.refreshToken);
            else setSessionToken(data.refreshToken)
        }
    }
}