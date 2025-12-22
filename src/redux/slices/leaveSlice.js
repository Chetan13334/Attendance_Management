import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
let socket;

const getAuthHeaders = () => ({
    'Content-Type': 'application/json'
});

export const fetchLeaveRequests = createAsyncThunk(
    "leaves/fetchLeaveRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/leaves`, {
                headers: getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) throw new Error("Failed to fetch leaves");

            const leaves = await response.json();
            return leaves.map(l => ({
                ...l,
                id: l._id,
                requestId: l._id // Consistency for UI
            }));
        } catch (error) {
            console.error("Error fetching leave requests:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Subscribe to real-time leave updates
export const subscribeToLeaveRequests = () => (dispatch) => {
    if (!socket) {
        socket = io(API_BASE_URL.replace('/api', ''), { withCredentials: true });
    }

    socket.off("leaveUpdated");
    socket.on("leaveUpdated", (leave) => {
        console.log("Leave updated event:", leave);
        // The backend emits the single updated/created leave
        dispatch(updateOrAddLeave({
            ...leave,
            id: leave._id,
            requestId: leave._id
        }));
    });

    return () => {
        if (socket) socket.off("leaveUpdated");
    };
};

export const updateLeaveStatus = createAsyncThunk(
    "leaves/updateLeaveStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/leaves/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify({ status })
            });

            if (!response.ok) throw new Error("Failed to update status");

            const updated = await response.json();
            return { id, status: updated.leave.status };

        } catch (error) {
            console.error("Error updating leave status:", error);
            return rejectWithValue(error.message);
        }
    }
);

const leaveSlice = createSlice({
    name: "leaves",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearLeaves(state) {
            state.list = [];
            state.error = null;
        },
        setLeaveRequests(state, action) {
            state.list = action.payload;
            state.loading = false;
        },
        updateOrAddLeave(state, action) {
            const leave = action.payload;
            const index = state.list.findIndex(l => l.id === leave.id);
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...leave };
            } else {
                state.list.unshift(leave); // Add new requests to top
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaveRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchLeaveRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateLeaveStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const index = state.list.findIndex((leave) => leave.id === id);
                if (index !== -1) {
                    state.list[index].status = status;
                }
            });
    },
});

export const { clearLeaves, setLeaveRequests, updateOrAddLeave } = leaveSlice.actions;
export default leaveSlice.reducer;
