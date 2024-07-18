import './App.sass';
import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useInstanceInterceptors} from "./utils/api/api";
import {useAuth} from "./utils/providers/AuthProvider";
import StartDataPage from "./pages/start-page/start-data-page";
import {ProjectPage} from "./pages/project-page/project-page";

function App() {

    useInstanceInterceptors();

    return (
        <Routes>
            {
                Router.map(route =>
                    <Route
                        path={route.link}
                        element={route.isPrivate ? <PrivateRoute>{route.element}</PrivateRoute> : route.element}
                        key={route.link}
                    />)
            }
        </Routes>
    );
}


export const RouterLinks = {
    Start: "/",
    LoadData: "/data",
    Project: "/project/:id",
    Main: "/test",
    NotFound: "/*"
}

const Router = [
    {
        link: RouterLinks.Start,
        element: <StartDataPage/>,
    },
    {
        link: RouterLinks.Project,
        element: <ProjectPage/>,
        isPrivate: true
    },
    {
        link: RouterLinks.NotFound,
        element: <Navigate to={RouterLinks.Start}/>,
    },
]

//Хок, делающий путь недоступным для неавторизованного пользователя
const PrivateRoute = ({children}: {children: React.ReactElement}) => {
    const {isAuth} = useAuth();

    return (
        isAuth ? children : <Navigate to={RouterLinks.Start}/>
    )
}

export default App;
