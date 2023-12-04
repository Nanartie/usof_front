import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { AuthReduc } from './reducers/authReduc.js';
import store from './api/help/index.js';
import { Provider } from 'react-redux';

const rootElement = document.getElementById('root');

const RootComponent = () => (
    <BrowserRouter>
        <Provider store={store}>
            <AuthReduc>
                <Routes>
                    <Route path='/*' element={<App />} />
                </Routes>
            </AuthReduc>
        </Provider>
    </BrowserRouter>
);

ReactDOM.createRoot(rootElement).render(<RootComponent />);