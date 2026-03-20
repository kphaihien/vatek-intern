import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet" />,
}));

// ✅ Fix: dùng jest.fn() trực tiếp bên trong mock, không khai báo biến ngoài
// Lý do: jest.mock được hoist lên trên cùng, nên biến khai báo bên ngoài chưa tồn tại
jest.mock('../i18n/i18n', () => ({
  changeLanguage: jest.fn(),
  language: 'vi',
}));

// Mock antd
jest.mock('antd', () => ({
  ConfigProvider: ({ children }) => <>{children}</>,
  FloatButton: ({ onClick, tooltip, icon }) => (
    <button data-testid="float-button" onClick={onClick} title={tooltip}>
      {icon}
    </button>
  ),
}));

// Mock antd icons
jest.mock('@ant-design/icons', () => ({
  SyncOutlined: () => <span data-testid="sync-icon" />,
}));

import App from '../App';
import i18n from '../i18n/i18n'; // import sau mock → lấy được bản mock

const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

describe('App', () => {
  beforeEach(() => jest.clearAllMocks());

  it('render successfully', () => {
    renderApp();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('render FloatButton', () => {
    renderApp();
    expect(screen.getByTestId('float-button')).toBeInTheDocument();
  });

  it('render tooltip on FloatButton', () => {
    renderApp();
    expect(screen.getByTitle('mainPage.changeLanguage')).toBeInTheDocument();
  });

  it('FloatButton has SyncOutlined Icon', () => {
    renderApp();
    expect(screen.getByTestId('sync-icon')).toBeInTheDocument();
  });

  it('click FloatButton to change "vi" to "en"', () => {
    renderApp();
    fireEvent.click(screen.getByTestId('float-button'));
    // i18n ở đây là bản mock, truy cập trực tiếp jest.fn()
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
  });

  it(' render outlet', () => {
    renderApp();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
