import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: () => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');

    let initialToken = null;
    let initialEmail = null;

    if (storedToken) {
      const tokenData = JSON.parse(storedToken);
      if (tokenData.expires > Date.now()) {
        initialToken = tokenData.value;
      } else {
        localStorage.removeItem('token');
      }
    }

    if (storedEmail) {
      const emailData = JSON.parse(storedEmail);
      if (emailData.expires > Date.now()) {
        initialEmail = emailData.value;
      } else {
        localStorage.removeItem('email');
      }
    }

    return {
      token: initialToken,
      email: initialEmail,
    };
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.value; // Accessing the 'value' property of the payload
    },
    setEmail: (state, action) => {
      state.email = action.payload.value; // Accessing the 'value' property of the payload
    }
  },
});

export const { setToken, setEmail } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectEmail = (state) => state.auth.email;
export default authSlice.reducer;
