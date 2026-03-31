import { createBrowserRouter } from 'react-router-dom';
import ToDoApp from '../pages/ToDoApp';
import EmployeeRender from '../pages/EmployeeRender';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import App from '../App';
import Profile from '../pages/Profile';
import PrivateRoute from './PrivateRoute';
import GuestRoute from './GuestRoute';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/todoapp',
        element: (
          <PrivateRoute>
            <ToDoApp />
          </PrivateRoute>
        ),
      },
      {
        path: '/employees',
        element: <EmployeeRender />,
      },
      {
        path: '/login',
        element: (
          <GuestRoute>
            <LoginPage />,
          </GuestRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
export default router;
