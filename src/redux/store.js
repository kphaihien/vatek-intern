import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import userReducer from './userSlice';
export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    user: userReducer,
  },
});
