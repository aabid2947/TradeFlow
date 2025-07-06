
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import publicRoutes from './routes/publicRoutes';

function App() {
  const router = createBrowserRouter([
    ...publicRoutes,
    // You can add other routes here
    {
      path: '*',
      element: <div>404 Not Found</div>, // Add a 404 page
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App
