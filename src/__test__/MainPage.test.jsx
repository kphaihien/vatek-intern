import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('antd', () => ({
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

const renderMainPage = () =>
  render(
    <MemoryRouter>
      <MainPage />
    </MemoryRouter>
  );

describe('MainPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('render all buttons', () => {
    renderMainPage();
    expect(screen.getByText('ToDo App')).toBeInTheDocument();
    expect(screen.getByText('Employee Rendering with Redux')).toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('navigate to /todoapp when click ToDo app', () => {
    renderMainPage();
    fireEvent.click(screen.getByText('ToDo App'));
    expect(mockNavigate).toHaveBeenCalledWith('/todoapp');
  });

  it(' navigate to /employees when click Employee Rendering with Redux', () => {
    renderMainPage();
    fireEvent.click(screen.getByText('Employee Rendering with Redux'));
    expect(mockNavigate).toHaveBeenCalledWith('/employees');
  });

  it('navigate to /login when click Login Page', () => {
    renderMainPage();
    fireEvent.click(screen.getByText('Login Page'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('do nothing before click ', () => {
    renderMainPage();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
