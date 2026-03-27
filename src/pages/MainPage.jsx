import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const MainPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="grid justify-around w-full min-h-screen grid-cols-4 bg-gray-200 ">
        <div className="col-span-1 place-self-center">
          <Button
            onClick={() => navigate('/todoapp')}
            type="primary"
            className="w-full cursor-pointer min-w-30"
          >
            ToDo App
          </Button>
        </div>
        <div className="col-span-1 place-self-center">
          <Button
            onClick={() => navigate('/employees')}
            type="primary"
            className="w-full cursor-pointer"
          >
            Employee Rendering with Redux
          </Button>
        </div>
        <div className="col-span-1 place-self-center">
          <Button
            onClick={() => navigate('/login')}
            type="primary"
            className="w-full cursor-pointer min-w-30"
          >
            Login Page
          </Button>
        </div>
        <div className="col-span-1 place-self-center">
          <Button
            onClick={() => navigate('/profile')}
            type="primary"
            className="w-full cursor-pointer min-w-30"
          >
            Profile
          </Button>
        </div>
      </div>
    </>
  );
};

export default MainPage;
