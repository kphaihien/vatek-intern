import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { logOutUser } from '../redux/userSlice';
import { useTranslation } from 'react-i18next';
const Profile = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    googleLogout();
    dispatch(logOutUser());
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <div className="flex flex-col items-center justify-center w-1/4 gap-4 bg-purple-400 rounded-lg h-2/3">
          <img className="rounded-full " src={user.picture} />
          <p className="px-2 py-1 font-bold bg-white rounded-lg">
            {t('profile.name')} {user.name}
          </p>
          <p>
            {t('profile.email')} {user.email}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-2 py-1 transition transform bg-yellow-300 rounded-lg cursor-pointer w-30 hover:scale-105"
            >
              {t('profile.backHome')}
            </button>

            <button
              onClick={handleLogout}
              className="px-2 py-1 transition transform bg-yellow-300 rounded-lg cursor-pointer w-30 hover:scale-105"
            >
              {t('profile.logout')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
