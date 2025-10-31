import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, provider } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Async thunk for email/password signup
export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: name,
          email: user.email,
        })
      );
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          name: name
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for email/password signin
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
        })
      );
      
      return {
        user: {
          uid: user.uid,
          email: user.email
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for Google signup/signin
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user data in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    showSuccessMessage: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.showSuccessMessage = false;
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setShowSuccessMessage: (state, action) => {
      state.showSuccessMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Email signup cases
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Email signin cases
      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.showSuccessMessage = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google signin/signup cases
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.showSuccessMessage = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, logout, setUser, setShowSuccessMessage } = authSlice.actions;
export default authSlice.reducer;