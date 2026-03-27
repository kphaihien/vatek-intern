import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider } from 'react-router-dom';
import router from '../src/router/router.jsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import './i18n/i18n.js';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="161052523074-j5fbl3137ruiphnpkt3tj3jnvmo4vg60.apps.googleusercontent.com">
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </GoogleOAuthProvider>
);
