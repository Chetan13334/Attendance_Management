import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper to get headers
const getHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// --- Thunks ---

export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch, getState }) => {
    // First, check if we have a user in localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      // Optimistically set the user from localStorage
      dispatch(setUser(savedUser));
    }

    // Then verify with backend (but don't logout on network errors)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const user = {
          ...data.user,
          uid: data.user.id,
          photo: data.user.picture || data.user.image || null
        };

        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
      } else if (response.status === 401 || response.status === 403) {
        // Only logout on explicit authentication failures
        console.log("Session expired or unauthorized");
        localStorage.removeItem("user");
        dispatch(logout());
      } else {
        // For other errors (500, network issues), keep the user logged in
        console.warn("Auth check failed with status:", response.status);
        // Keep using the savedUser from localStorage
      }
    } catch (e) {
      // Network error or backend down - keep user logged in from localStorage
      console.warn("Auth check failed (network error):", e.message);
      // Don't logout - the user might still have a valid session
      // The backend will reject requests if the session is actually invalid
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password, name, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password, name, role: role || 'employee' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Data expected: { user: {...}, token: "..." }
      const user = {
        ...data.user,
        uid: data.user.id,
        photo: data.user.picture || null
      };

      localStorage.setItem("user", JSON.stringify(user));
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      return { user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (idToken, { rejectWithValue }) => {
    // Note: The frontend component usually handles the Google Popup and gets the idToken.
    // Then we send it here. If the existing component was using signInWithPopup(auth, provider),
    // we need to adjust the calling component to use a Google Login library or similar, 
    // OR we might need to keep firebase/auth JUST for the client-side popup if not using 'react-google-login'.
    // WITHOUT Firebase client SDK, you need 'react-oauth/google' or similar.
    // Assuming for now the caller provides the token or we adapt.

    // IF we are removing Firebase completely, we cannot use `signInWithPopup(auth, provider)`.
    // The user needs a way to get the Google ID Token.

    // For this migration step, I will assume the backend accepts the token. 
    // But generating the token on client usually requires a library.

    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      const user = {
        ...data.user,
        uid: data.user.id,
        photo: data.user.picture
      };

      localStorage.setItem("user", JSON.stringify(user));
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      return { user };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, { rejectWithValue }) => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } catch (error) {
      // Even if backend fails, clear local state
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      return rejectWithValue(error.message);
    }
  }
);

const savedUser = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser || null,
    loading: false,
    error: null,
    isAuthenticated: !!savedUser,
    showSuccessMessage: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.showSuccessMessage = false;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setShowSuccessMessage: (state, action) => {
      state.showSuccessMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.showSuccessMessage = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.showSuccessMessage = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign Out
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.showSuccessMessage = false;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Auth State Check
      .addCase(listenToAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToAuthState.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(listenToAuthState.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, logout, setUser, setShowSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
