
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify';
createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <ToastContainer />
    </>
)
