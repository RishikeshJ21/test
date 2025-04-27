import { createRoot } from 'react-dom/client';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for ToastContainer

// Create root and render the app
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        // <React.StrictMode>
            <BrowserRouter>
                <App />
                <ToastContainer />
            </BrowserRouter>
        // </React.StrictMode>
    );
}
