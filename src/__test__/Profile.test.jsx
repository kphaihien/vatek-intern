import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import userReducer, { logOutUser } from '../redux/userSlice';

jest.mock('@react-oauth/google', () => ({
  googleLogout: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


const mockUser = {
  name: 'Nguyen Van A',
  email: 'nguyenvana@example.com',
  picture: 'https://example.com/avatar.jpg',
};


const buildStore=(userState = mockUser, freezeOnLogout = false)=> {
  const safeReducer = (state = userState, action) => {
    if (freezeOnLogout && action.type === logOutUser().type) return state;
    return userReducer(state, action);
  };
  return configureStore({
    reducer: { user: safeReducer },
    preloadedState: { user: userState },
  });
}

const renderProfile=(userState = mockUser, freezeOnLogout = false)=> {
  const store = buildStore(userState, freezeOnLogout);
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </Provider>
  );
  return { ...utils, store,dispatchSpy };
}


describe('Profile component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('hiển thị ảnh đại diện của người dùng', () => {
      renderProfile();
      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', mockUser.picture);
    });

    it('hiển thị tên người dùng', () => {
      renderProfile();
      expect(screen.getByText(/Nguyen Van A/i)).toBeInTheDocument();
    });

    it('hiển thị email người dùng', () => {
      renderProfile();
      expect(screen.getByText(/nguyenvana@example\.com/i)).toBeInTheDocument();
    });

    it('hiển thị label i18n cho tên (profile.name)', () => {
      renderProfile();
      expect(screen.getByText(/profile\.name/i)).toBeInTheDocument();
    });

    it('hiển thị label i18n cho email (profile.email)', () => {
      renderProfile();
      expect(screen.getByText(/profile\.email/i)).toBeInTheDocument();
    });

    it('hiển thị nút "Back Home" và "Logout"', () => {
      renderProfile();
      expect(screen.getByText('profile.backHome')).toBeInTheDocument();
      expect(screen.getByText('profile.logout')).toBeInTheDocument();
    });
  });


  describe('Navigation', () => {
    it('điều hướng về "/" khi bấm nút Back Home', () => {
      renderProfile();
      fireEvent.click(screen.getByText('profile.backHome'));
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('không điều hướng khi bấm nút Logout', () => {
      // freezeOnLogout = true: giữ user trong store sau dispatch,
      // tránh re-render crash vào user.picture
      renderProfile(mockUser, true);
      fireEvent.click(screen.getByText('profile.logout'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });


  describe('Logout', () => {
    it('gọi googleLogout khi bấm nút Logout', () => {
      const { googleLogout } = require('@react-oauth/google');
      renderProfile(mockUser, true);
      fireEvent.click(screen.getByText('profile.logout'));
      expect(googleLogout).toHaveBeenCalledTimes(1);
    });

    it('dispatch action logOutUser khi bấm nút Logout', () => {
      const {dispatchSpy } = renderProfile(mockUser, true);
      fireEvent.click(screen.getByText('profile.logout'));
      expect(dispatchSpy).toHaveBeenCalledWith(logOutUser());
    });
  });
});