import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { mockUser } from '../data/mockData';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onFinish = (values) => {
    try {
      if (values.username === mockUser.username && values.password === mockUser.password) {
        dispatch(setUser(values));
        alert(t('login.success'));
      } else {
        alert(t('login.error'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem('token', tokenResponse.access_token);
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      dispatch(
        setUser({
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        })
      );
      navigate('/profile');
    },
    onError: (err) => console.log(err),
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-purple-200 px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <Form
          layout="vertical"
          className="w-full rounded-xl p-6 sm:p-8"
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={t('login.username')}
            name="username"
            className="w-full"
            rules={[{ required: true, message: t('login.usernameRequired') }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t('login.password')}
            name="password"
            className="w-full"
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" className="w-full" size="large">
              {t('login.submit')}
            </Button>
          </Form.Item>

          <div className="flex flex-col gap-3">
            <div
              onClick={handleLoginGoogle}
              className="flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-400 py-2 transition hover:scale-105 hover:bg-purple-100"
            >
              <svg
                className="h-6 w-6 shrink-0"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <path
                  fill="#4285F4"
                  d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z"
                />
                <path
                  fill="#34A853"
                  d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z"
                />
                <path
                  fill="#FBBC04"
                  d="M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z"
                />
                <path
                  fill="#EA4335"
                  d="M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Login with Google</span>
            </div>

            <div className="flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-400 py-2 transition hover:scale-105 hover:bg-purple-100">
              <svg
                className="h-6 w-6 shrink-0"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <path
                  fill="#1877F2"
                  d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
                />
                <path
                  fill="#ffffff"
                  d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
                />
              </svg>
              <FacebookLogin
                appId="1497962341983641"
                onSuccess={async (response) => {
                  localStorage.setItem('token', response.accessToken);
                  const res = await fetch(
                    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${response.accessToken}`
                  );
                  const data = await res.json();
                  dispatch(setUser({ ...data, picture: data.picture.data.url }));
                }}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
