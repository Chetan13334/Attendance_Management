import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

// ✅ Real-time listener renamed to listenToEmployees (Calendar needs this)
export const listenToEmployees = createAsyncThunk(
  "employees/listenToEmployees",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("Setting up employee listener");
      const unsubscribe = onSnapshot(
        collection(db, "Employee_Details"),
        (snapshot) => {
          console.log(`Received employee snapshot with ${snapshot.docs.length} documents`);
          const employees = snapshot.docs.map((d) => {
            const data = d.data();

            return {
              id: d.id,
              empId: String(data?.EmployeeID ?? data?.employeeId ?? d.id), // Use EmployeeID field or fallback to document ID
              name: data?.Name ?? data?.name ?? "Unknown",
              ...data,

              // ✅ Safely convert timestamps to ISO string
              DateOfBirth: data.DateOfBirth?.toDate
                ? data.DateOfBirth.toDate().toISOString()
                : data.DateOfBirth || null,

              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate().toISOString()
                : data.createdAt || null,
            };
          });

          console.log("Dispatching employees:", employees.length);
          dispatch(setEmployees(employees));
        },
        (error) => {
          console.error("Employee listener error:", error);
          dispatch(setEmployees([])); // Clear employees on error
        }
      );

      // Return a cleanup function
      return () => {
        console.log("Cleaning up employee listener");
        unsubscribe();
      };
    } catch (err) {
      console.error("Employee listener setup error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ➕ Create Employee
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData) => {
    const docRef = await addDoc(collection(db, "Employee_Details"), {
      ...employeeData,
      createdAt: new Date(), // Firestore will store timestamp
    });
    return { id: docRef.id, ...employeeData };
  }
);

// ♻️ Update Employee
export const updateEmployeeAsync = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, updatedData }) => {
    const empRef = doc(db, "Employee_Details", id);
    await updateDoc(empRef, updatedData);
    return { id, updatedData };
  }
);

// ❌ Delete Employee
export const deleteEmployeeAsync = createAsyncThunk(
  "employees/deleteEmployee",
  async (id) => {
    await deleteDoc(doc(db, "Employee_Details", id));
    return id;
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: true, // Start loading by default to prevent flash of empty state
    currentEmployee: null,
    error: null,
  },
  reducers: {
    setEmployees(state, action) {
      console.log("Setting employees in Redux:", action.payload.length);
      // Ensure we're creating a new array reference
      state.list = [...action.payload];
      state.loading = false; // ✅ Data received, stop loading
    },
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },
    clearEmployees(state) {
      console.log("Clearing employees data from Redux store");
      state.list = [];
      state.error = null;
      // state.loading = false; // Don't reset loading here, let the listener handle it
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToEmployees.fulfilled, (state) => {
        // state.loading = false; // ❌ Don't stop loading here, wait for data
        console.log("Employee listener setup complete");
      })
      .addCase(listenToEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = []; // Clear list on error
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.list.findIndex((emp) => emp.id === id);
        if (index !== -1) state.list[index] = { ...state.list[index], ...updatedData };
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((emp) => emp.id !== action.payload);
      });
  },
});

export const { setEmployees, clearCurrentEmployee, clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;