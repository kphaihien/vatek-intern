import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { mockUser } from '../data/mockData';
const LoginPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const onFinish = (values) => {
    try {
      if (values.username === mockUser.username && values.password === mockUser.password) {
        alert(t('login.success'));
        navigate('/employees');
      } else {
        alert(t('login.error'));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="grid w-full h-screen grid-cols-3 bg-purple-200">
        <Form
          layout="vertical"
          className="flex flex-col items-start self-center w-full col-start-2 rounded-lg"
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
            <Input />
          </Form.Item>

          <Form.Item
            label={t('login.password')}
            name="password"
            className="w-full "
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="self-end" label={null}>
            <Button type="primary" htmlType="submit" className="">
              {t('login.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default LoginPage;
