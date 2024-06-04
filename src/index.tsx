import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./assets/style/index.sass"
import {QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./utils/AuthProvider";
import {NotificationProvider} from "./components/base/notification/notification-provider";
import {queryClient} from "./utils/api";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <NotificationProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </QueryClientProvider>
            </NotificationProvider>
        </BrowserRouter>
    </React.StrictMode>
);
