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
              empId: String(data?.EmployeeID ?? data?.employeeId ?? d.id), 
              name: data?.Name ?? data?.name ?? "Unknown",
              ...data,

              
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
          dispatch(setEmployees([])); 
        }
      );

      
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


export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData) => {
    const docRef = await addDoc(collection(db, "Employee_Details"), {
      ...employeeData,
      createdAt: new Date(), 
    });
    return { id: docRef.id, ...employeeData };
  }
);


export const updateEmployeeAsync = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, updatedData }) => {
    const empRef = doc(db, "Employee_Details", id);
    await updateDoc(empRef, updatedData);
    return { id, updatedData };
  }
);


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
    loading: true,
    currentEmployee: null,
    error: null,
  },
  reducers: {
    setEmployees(state, action) {
      console.log("Setting employees in Redux:", action.payload.length);
      
      state.list = [...action.payload];
      state.loading = false; 
    },
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },
    clearEmployees(state) {
      console.log("Clearing employees data from Redux store");
      state.list = [];
      state.error = null;
     
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToEmployees.fulfilled, (state) => {
        
        console.log("Employee listener setup complete");
      })
      .addCase(listenToEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = []; 
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