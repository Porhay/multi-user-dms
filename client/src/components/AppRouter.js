import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { authRoutes, publicRoutes } from '../routes';
import AuthenticationPage from '../pages/Authentication';
import DictionariesPage from '../pages/Dictionaries';


const AppRouter = observer(() => {
  const { user } = useContext(Context);

  // TODO Replace Route path='*' with redirecting component '/' route
  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route path={path} element={<Component />} exact />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route path={path} element={<Component />} exact />
      ))}
      {user.isAuth
        ? <Route path="*" element={<DictionariesPage />} exact />
        : <Route path="*" element={<AuthenticationPage />} exact />
      }
    </Routes>
  );
});

export default AppRouter;
