import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './features/auth/authSlice';
import AppRoutes from "./routes/index.jsx"; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;