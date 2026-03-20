import { createSlice } from '@reduxjs/toolkit';
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employeeList: [],
  },
  reducers: {
    setEmployeeList: (state, action) => {
      state.employeeList = action.payload;
    },
    addEmployee: (state, action) => {
      state.employeeList = [...state.employeeList, action.payload];
    },
    deleteEmployee: (state, action) => {
      state.employeeList = state.employeeList.filter((empl) => empl.id !== action.payload.id);
    },
    editEmployee: (state, action) => {
      state.employeeList = state.employeeList.map((empl) => {
        return empl.id === action.payload.id ? (empl = action.payload) : empl;
      });
    },
  },
});
export const { setEmployeeList, addEmployee, deleteEmployee, editEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
