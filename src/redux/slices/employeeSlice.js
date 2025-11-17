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
      const unsubscribe = onSnapshot(
        collection(db, "Employee_Details"),
        (snapshot) => {
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

          dispatch(setEmployees(employees));
        },
        (error) => {
          console.error("Employee listener error:", error);
          dispatch(setEmployees([])); // Clear employees on error
        }
      );
      
      // Return a cleanup function
      return () => {
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
    loading: false,
    currentEmployee: null,
    error: null,
  },
  reducers: {
    setEmployees(state, action) {
      // Ensure we're creating a new array reference
      state.list = [...action.payload];
    },
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToEmployees.fulfilled, (state) => {
        state.loading = false;
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

export const { setEmployees, clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;