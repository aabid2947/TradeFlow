import { createBrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.jsx"; 


const App = createBrowserRouter([
  {
    path: "*",
    Component: AppRoutes,
  },
]);

export default App;