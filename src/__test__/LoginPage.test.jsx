import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../pages/LoginPage';
import userReducer from '../redux/userSlice';
import { mockUser } from '../data/mockData';



const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));


let googleSuccessHandler;
let googleErrorHandler;
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: ({ onSuccess, onError }) => {
    googleSuccessHandler = onSuccess;
    googleErrorHandler = onError;
    return jest.fn(); // hàm trả về để gán vào onClick
  },
}));

jest.mock(
  '@greatsumini/react-facebook-login',
  () =>
    function FacebookLogin({ onSuccess }) {
      return (
        <button data-testid="fb-login" onClick={() => onSuccess({ accessToken: 'fb-token' })}>
          Facebook Login
        </button>
      );
    }
);

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children, onFinish }) => (
    <form
      data-testid="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        onFinish && onFinish(Object.fromEntries(data.entries()));
      }}
    >
      {children}
    </form>
  );

  Form.Item = ({ children, label, name }) => (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      {React.Children.map(children, (child) =>
        child ? React.cloneElement(child, { id: name, name }) : child
      )}
    </div>
  );

  Form.useForm = () => [{ resetFields: jest.fn() }];

  const Input = React.forwardRef(({ id, name, ...props }, ref) => (
    <input id={id} name={name} ref={ref} {...props} />
  ));
  Input.Password = React.forwardRef(({ id, name, ...props }, ref) => (
    <input id={id} name={name} type="password" ref={ref} {...props} />
  ));

  const Button = ({ children, htmlType, ...props }) => (
    <button type={htmlType || 'button'} {...props}>
      {children}
    </button>
  );

  return { Form, Input, Button };
});



function buildStore() {
  return configureStore({
    reducer: { user: userReducer },
  });
}

function renderLoginPage() {
  const store = buildStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
  return { ...utils, store, dispatchSpy };
}

function fillAndSubmit(username, password) {
  fireEvent.change(screen.getByLabelText('login.username'), {
    target: { value: username, name: 'username' },
  });
  fireEvent.change(screen.getByLabelText('login.password'), {
    target: { value: password, name: 'password' },
  });
  fireEvent.submit(screen.getByTestId('login-form'));
}


describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });



  describe('Rendering', () => {
    it('hiển thị form đăng nhập', () => {
      renderLoginPage();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('hiển thị trường username', () => {
      renderLoginPage();
      expect(screen.getByLabelText('login.username')).toBeInTheDocument();
    });

    it('hiển thị trường password', () => {
      renderLoginPage();
      expect(screen.getByLabelText('login.password')).toBeInTheDocument();
    });

    it('trường password có type="password"', () => {
      renderLoginPage();
      expect(screen.getByLabelText('login.password')).toHaveAttribute('type', 'password');
    });

    it('hiển thị nút submit', () => {
      renderLoginPage();
      expect(screen.getByText('login.submit')).toBeInTheDocument();
    });

    it('hiển thị nút Login with Google', () => {
      renderLoginPage();
      expect(screen.getByText('Login with Google')).toBeInTheDocument();
    });

    it('hiển thị nút Facebook Login', () => {
      renderLoginPage();
      expect(screen.getByTestId('fb-login')).toBeInTheDocument();
    });
  });


  describe('Form interaction', () => {
    it('cho phép nhập vào trường username', () => {
      renderLoginPage();
      const input = screen.getByLabelText('login.username');
      fireEvent.change(input, { target: { value: 'hien' } });
      expect(input).toHaveValue('hien');
    });

    it('cho phép nhập vào trường password', () => {
      renderLoginPage();
      const input = screen.getByLabelText('login.password');
      fireEvent.change(input, { target: { value: '123123' } });
      expect(input).toHaveValue('123123');
    });
  });

  describe('Login thành công (đúng credentials)', () => {
    it('hiển thị alert thành công', async () => {
      renderLoginPage();
      fillAndSubmit(mockUser.username, mockUser.password);
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('login.success');
      });
    });

    it('dispatch setUser với thông tin đăng nhập', async () => {
      const { dispatchSpy } = renderLoginPage();
      fillAndSubmit(mockUser.username, mockUser.password);
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled();
      });
    });

    it('không hiển thị alert lỗi', async () => {
      renderLoginPage();
      fillAndSubmit(mockUser.username, mockUser.password);
      await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalledWith('login.error');
      });
    });
  });


  describe('Login thất bại (sai credentials)', () => {
    it('hiển thị alert lỗi', async () => {
      renderLoginPage();
      fillAndSubmit('wrong', 'wrong');
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('login.error');
      });
    });

    it('không dispatch setUser', async () => {
      const { dispatchSpy } = renderLoginPage();
      fillAndSubmit('wrong', 'wrong');
      await waitFor(() => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    it('không navigate đi đâu', async () => {
      renderLoginPage();
      fillAndSubmit('wrong', 'wrong');
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Google Login', () => {
    it('dispatch setUser và navigate về /profile khi Google login thành công', async () => {
      const { dispatchSpy } = renderLoginPage();


      global.fetch = jest.fn().mockResolvedValue({
        json: async () => ({
          sub: 'google-id-123',
          email: 'user@gmail.com',
          name: 'Google User',
          picture: 'https://example.com/pic.jpg',
        }),
      });

      await googleSuccessHandler({ access_token: 'google-token' });

      expect(dispatchSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });
});
