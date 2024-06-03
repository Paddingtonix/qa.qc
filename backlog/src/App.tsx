import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import StartDataPage from "./pages/start-page/start-data-page";
import {useInstanceInterceptors} from "./utils/api";
import {ProjectPage} from "./pages/project-page/project-page";
import {useAuth} from "./utils/AuthProvider";
import React from "react";


function App() {

    useInstanceInterceptors();

    return (
        <Routes>
            <Route path={Links.Start} element={<StartDataPage/>}/>
            <Route path={Links.Project} element={<PrivateRoute><ProjectPage/></PrivateRoute>}/>
            {/* <Route path={Links.Main} element={<PrivateRoute><Main/></PrivateRoute>}/> */}
            <Route path={Links.NotFound} element={<Navigate to={Links.Start}/>}/>
        </Routes>
    );
}

export const Links = {
    Start: "/",
    LoadData: "/data",
    Project: "/project/:id",
    Main: "/test",
    NotFound: "/*"
}

//Хок, делающий путь недоступным для неавторизованного пользователя
const PrivateRoute = ({children}: {children: React.ReactElement}) => {
    const {isAuth} = useAuth();

    return (
        isAuth ? children : <Navigate to={Links.Start}/>
    )
}

export default App;
