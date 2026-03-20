import { createBrowserRouter } from 'react-router-dom';
import ToDoApp from '../pages/ToDoApp';
import EmployeeRender from '../pages/EmployeeRender';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import App from '../App';
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
        element: <ToDoApp />,
      },
      {
        path: '/employees',
        element: <EmployeeRender />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);
export default router;
