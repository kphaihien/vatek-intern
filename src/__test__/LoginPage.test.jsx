import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children, onFinish }) => (
    <form
      data-testid="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const values = Object.fromEntries(data.entries());
        onFinish && onFinish(values);
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

  const Checkbox = ({ children, ...props }) => (
    <label>
      <input type="checkbox" {...props} />
      {children}
    </label>
  );

  return { Form, Input, Button, Checkbox };
});

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders the login form', () => {
    renderLoginPage();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders username field', () => {
    renderLoginPage();
    expect(screen.getByLabelText('login.username')).toBeInTheDocument();
  });

  it('renders password field', () => {
    renderLoginPage();
    expect(screen.getByLabelText('login.password')).toBeInTheDocument();
  });

  it('renders login button', () => {
    renderLoginPage();
    expect(screen.getByText('login.submit')).toBeInTheDocument();
  });

  it('allows typing in username field', () => {
    renderLoginPage();
    const input = screen.getByLabelText('login.username');
    fireEvent.change(input, { target: { value: 'hien' } });
    expect(input.value).toBe('hien');
  });

  it('allows typing in password field', () => {
    renderLoginPage();
    const input = screen.getByLabelText('login.password');
    fireEvent.change(input, { target: { value: '123123' } });
    expect(input.value).toBe('123123');
  });

  it('navigates to /employees with true data', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText('login.username'), {
      target: { value: 'hien', name: 'username' },
    });
    fireEvent.change(screen.getByLabelText('login.password'), {
      target: { value: '123123', name: 'password' },
    });
    fireEvent.submit(screen.getByTestId('login-form'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employees');
    });
  });

  it('show success alert with true credentials', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText('login.username'), {
      target: { value: 'hien', name: 'username' },
    });
    fireEvent.change(screen.getByLabelText('login.password'), {
      target: { value: '123123', name: 'password' },
    });
    fireEvent.submit(screen.getByTestId('login-form'));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('login.success');
    });
  });

  it('no navigate with wrong credentials', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText('login.username'), {
      target: { value: 'wrong', name: 'username' },
    });
    fireEvent.change(screen.getByLabelText('login.password'), {
      target: { value: 'wrong', name: 'password' },
    });
    fireEvent.submit(screen.getByTestId('login-form'));
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('show error alert with wrong credentials', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText('login.username'), {
      target: { value: 'wrong', name: 'username' },
    });
    fireEvent.change(screen.getByLabelText('login.password'), {
      target: { value: 'wrong', name: 'password' },
    });
    fireEvent.submit(screen.getByTestId('login-form'));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('login.error');
    });
  });
});
