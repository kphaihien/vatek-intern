import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet" />,
}));

jest.mock('../i18n/i18n', () => ({
  changeLanguage: jest.fn(),
  language: 'vi',
}));

jest.mock('antd', () => ({
  ConfigProvider: ({ children }) => <>{children}</>,
  FloatButton: ({ onClick, tooltip, icon }) => (
    <button data-testid="float-button" onClick={onClick} title={tooltip}>
      {icon}
    </button>
  ),
}));

jest.mock('@ant-design/icons', () => ({
  SyncOutlined: () => <span data-testid="sync-icon" />,
}));

import App from '../App';
import i18n from '../i18n/i18n';

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
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
  });

  it(' render outlet', () => {
    renderApp();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
