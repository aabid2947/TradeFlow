import { Routes, Route } from 'react-router-dom';
import publicRoutes from './public';
import protectedRoutes from './protected';

const AppRoutes = () => {
  const allRoutes = [...publicRoutes, ...protectedRoutes];

  return (
    <Routes>
      {allRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
