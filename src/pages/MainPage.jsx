import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200 px-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-4 lg:px-12">
      <div className="flex w-full justify-center">
        <Button
          onClick={() => navigate('/todoapp')}
          type="primary"
          className="w-full max-w-xs cursor-pointer"
        >
          ToDo App
        </Button>
      </div>
      <div className="flex w-full justify-center">
        <Button
          onClick={() => navigate('/employees')}
          type="primary"
          className="w-full max-w-xs cursor-pointer"
        >
          Employee Rendering with Redux
        </Button>
      </div>
      <div className="flex w-full justify-center">
        <Button
          onClick={() => navigate('/login')}
          type="primary"
          className="w-full max-w-xs cursor-pointer"
        >
          Login Page
        </Button>
      </div>
      <div className="flex w-full justify-center">
        <Button
          onClick={() => navigate('/profile')}
          type="primary"
          className="w-full max-w-xs cursor-pointer"
        >
          Profile
        </Button>
      </div>
    </div>
  );
};

export default MainPage;
