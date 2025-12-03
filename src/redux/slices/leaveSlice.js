import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collectionGroup, getDocs, doc, updateDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchLeaveRequests = createAsyncThunk(
    "leaves/fetchLeaveRequests",
    async (_, { rejectWithValue }) => {
        try {
            // Using collectionGroup to fetch all 'dates' subcollections across all employees
            const leavesQuery = collectionGroup(db, "dates");
            const querySnapshot = await getDocs(leavesQuery);

            const leaves = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id, // This is the date string usually, or a unique ID
                    ...data,
                    // Ensure we have a consistent ID for the UI
                    requestId: doc.id,
                    path: doc.ref.path, // Store path for potential updates
                };
            });

            return leaves;
        } catch (error) {
            console.error("Error fetching leave requests:", error);
            return rejectWithValue(error.message);
        }
    }
);

// New: Set up real-time listener for leave requests
export const subscribeToLeaveRequests = () => (dispatch) => {
    const leavesQuery = query(collectionGroup(db, "dates"));

    const unsubscribe = onSnapshot(leavesQuery, (querySnapshot) => {
        const leaves = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                requestId: doc.id,
                path: doc.ref.path,
            };
        });

        dispatch(setLeaveRequests(leaves));
    }, (error) => {
        console.error("Error in leave requests listener:", error);
    });

    return unsubscribe;
};

export const updateLeaveStatus = createAsyncThunk(
    "leaves/updateLeaveStatus",
    async ({ path, status }, { rejectWithValue }) => {
        try {
            const leaveRef = doc(db, path);
            await updateDoc(leaveRef, { status });
            return { path, status };
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
                const { path, status } = action.payload;
                const index = state.list.findIndex((leave) => leave.path === path);
                if (index !== -1) {
                    state.list[index].status = status;
                }
            });
    },
});

export const { clearLeaves, setLeaveRequests } = leaveSlice.actions;
export default leaveSlice.reducer;
