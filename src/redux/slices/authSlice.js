import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// --- Thunks ---

/**
 * Verified Auth State
 * Checks with the backend if the current token is valid.
 * Does NOT set loading to true if we already have a user (optimistic).
 */
export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch, getState }) => {
    try {
      const response = await api.get("/auth/me");
      const data = response.data;

      if (data?.user) {
        const user = {
          ...data.user,
          uid: data.user.id || data.user._id,
          photo: data.user.picture || data.user.image || null
        };

        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
      } else {
        // Only logout if we are currently "authenticated" in Redux but the server says otherwise
        const { auth } = getState();
        if (auth.isAuthenticated) {
          dispatch(logout());
        }
      }
    } catch (e) {
      const { auth } = getState();
      // If unauthorized (401), clear the session
      if (e.message.toLowerCase().includes("unauthorized") || e.message.toLowerCase().includes("401")) {
        if (auth.isAuthenticated) {
          dispatch(logout());
        }
      }
      console.warn("Auth check failed:", e.message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Sending Reg Data to backend:", userData);
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Registration failed";
      console.error("Signup API error:", message);
      return rejectWithValue(message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      if (!data?.user) throw new Error("User data missing in response");

      const user = {
        ...data.user,
        uid: data.user.id || data.user._id,
        photo: data.user.picture || null
      };

      localStorage.setItem("user", JSON.stringify(user));
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      return { user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { idToken });
      const data = response.data;

      if (!data?.user) throw new Error("Google login failed: User data missing");

      const user = {
        ...data.user,
        uid: data.user.id || data.user._id,
        photo: data.user.picture
      };

      localStorage.setItem("user", JSON.stringify(user));
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      return { user };

    } catch (error) {
      const message = error.response?.data?.message || error.message || "Google login failed";
      return rejectWithValue(message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, { dispatch }) => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      dispatch(logout());
    }
  }
);


const getInitialUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
};

const savedUser = getInitialUser();

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
      localStorage.removeItem("authToken");
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
      // Auth State Check
      .addCase(listenToAuthState.pending, (state) => {
        // Only show loading if we haven't recovered a user from localStorage
        if (!state.isAuthenticated) {
          state.loading = true;
        }
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
