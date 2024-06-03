import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from "./utils/AuthProvider";
import {queryClient} from "./utils/api";
import {NotificationProvider} from "./components/base/notification/notification-provider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <NotificationProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </NotificationProvider>
    </BrowserRouter>

);