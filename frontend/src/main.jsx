
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ModalProvider} from "./pages/common/modal/ModalContext.jsx";
import {AuthProvider} from "./pages/common/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ModalProvider>
            <AuthProvider>
                <App />
          </AuthProvider>
        </ModalProvider>
    </BrowserRouter>
)
