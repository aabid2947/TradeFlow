// File: App.jsx (Corrected)

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/index'; // Make sure this path points to your routes/index.jsx
import './App.css';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;