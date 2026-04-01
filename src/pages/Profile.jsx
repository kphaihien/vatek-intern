import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { logOutUser } from '../redux/userSlice';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    dispatch(logOutUser());
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-8">
      <div className="flex h-full max-h-1/3 w-full max-w-xs flex-col items-center justify-center gap-4 rounded-lg bg-purple-400 px-6 py-10 sm:max-w-sm">
        <img
          className="h-24 w-24 rounded-full object-cover ring-2 ring-yellow-300 sm:h-32 sm:w-32"
          src={user.picture}
          alt={user.name}
        />

        <p className="rounded-lg bg-white px-3 py-1 text-center text-sm font-bold sm:text-base">
          {t('profile.name')} {user.name}
        </p>

        <p className="text-center text-sm break-all text-white sm:text-base">
          {t('profile.email')} {user.email}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="transform cursor-pointer rounded-lg bg-yellow-300 px-4 py-2 text-sm font-medium transition hover:scale-105 sm:text-base"
          >
            {t('profile.backHome')}
          </button>
          <button
            onClick={handleLogout}
            className="transform cursor-pointer rounded-lg bg-yellow-300 px-4 py-2 text-sm font-medium transition hover:scale-105 sm:text-base"
          >
            {t('profile.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
