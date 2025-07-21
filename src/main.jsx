import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from './app/store';
// 1. Import the router configuration
import App from './App.jsx';

// 2. Import your global stylesheet
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* 3. Pass the imported router to the RouterProvider */}
      <RouterProvider router={App} />
    </Provider>
  </StrictMode>,
);