import { createSlice } from '@reduxjs/toolkit';
const initialState = null;
const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    logOutUser: () => {
      return initialState;
    },
  },
});
export const { setUser, logOutUser } = userSlice.actions;
export default userSlice.reducer;
