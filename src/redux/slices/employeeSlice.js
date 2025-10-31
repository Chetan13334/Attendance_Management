import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    collection, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    addDoc, // ✅ Added for createEmployee
    getDoc // ✅ Added for fetchEmployeeById
} from "firebase/firestore";
import { db } from "../../firebase";

// --- ASYNC THUNKS (The new Redux logic for Firebase CRUD) ---

// 1. Fetch ALL Employees (Used by Employee_Details table)
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const querySnapshot = await getDocs(collection(db, "Employee_Details"));
    let employeesList = [];
    querySnapshot.forEach((docItem) => {
      employeesList.push({ id: docItem.id, ...docItem.data() });
    });
    return employeesList;
  }
);

// 2. Fetch a SINGLE Employee by ID (Used by EditEmployee)
export const fetchEmployeeById = createAsyncThunk(
    'employees/fetchEmployeeById',
    async (id) => {
        const empRef = doc(db, "Employee_Details", id);
        const empSnap = await getDoc(empRef);
        if (empSnap.exists()) {
            return { id: id, ...empSnap.data() };
        }
        // In a real app, you might throw an error here: throw new Error('Employee not found');
        return null; 
    }
);

// 3. Create a NEW Employee (Used by EmployeeForm)
export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async (employeeData) => {
        // NOTE: employeeData should already include the Photo URL
        const docRef = await addDoc(collection(db, "Employee_Details"), {
            ...employeeData,
            createdAt: new Date().toISOString(), // Optional: Add timestamp
        });
        // Return the new ID along with the data
        return { id: docRef.id, ...employeeData }; 
    }
);

// 4. Update Employee in Firestore (Used by EditEmployee)
export const updateEmployeeAsync = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, updatedData }) => {
    const empRef = doc(db, "Employee_Details", id);
    await updateDoc(empRef, updatedData);
    return { id, updatedData }; 
  }
);

// 5. Delete Employee from Firestore (Used by EditEmployee)
export const deleteEmployeeAsync = createAsyncThunk(
  "employees/deleteEmployee",
  async (id) => {
    await deleteDoc(doc(db, "Employee_Details", id));
    return id; 
  }
);

// --- SLICE DEFINITION ---

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [], 
    loading: false, 
    currentEmployee: null, // 🆕 State for the employee being edited
    error: null, // 🆕 State for error handling
  },
  reducers: {
    setEmployees(state, action) {
      state.list = action.payload;
    },
    // 🆕 Allows the EditEmployee form to update fields locally before final save
    updateCurrentEmployeeField(state, action) {
        if (state.currentEmployee) {
            const { field, value } = action.payload;
            state.currentEmployee = {
                ...state.currentEmployee,
                [field]: value
            };
        }
    },
    clearCurrentEmployee(state) {
        state.currentEmployee = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- fetchEmployees ---
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })

    // --- fetchEmployeeById --- 🆕
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentEmployee = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload; // Set the employee data
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee details';
      })

    // --- createEmployee --- 🆕
      .addCase(createEmployee.fulfilled, (state, action) => {
        // Add the new employee to the list immediately
        state.list.push(action.payload);
        state.error = null;
      })

      // --- updateEmployeeAsync ---
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.list.findIndex(emp => emp.id === id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...updatedData };
        }
        // Also update the currentEmployee state if it's the one we just updated
        if (state.currentEmployee && state.currentEmployee.id === id) {
            state.currentEmployee = { ...state.currentEmployee, ...updatedData };
        }
      })

      // --- deleteEmployeeAsync ---
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp.id !== action.payload);
        state.currentEmployee = null; // Clear the deleted employee from edit view
      });
  },
});

export const { setEmployees, updateCurrentEmployeeField, clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;