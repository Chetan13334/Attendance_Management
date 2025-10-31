import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    employees: [],
    loading: false,
    // You could add 'error: null' here for more robust error handling
  },
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setEmployees, setLoading } = attendanceSlice.actions;

// ✅ Real-time listener to Employee_Details
// This thunk is correctly named and returns the unsubscribe function.
export const subscribeToEmployees = () => (dispatch) => {
  dispatch(setLoading(true));

  const empCollection = collection(db, "Employee_Details");

  // Return the unsubscribe function for cleanup in the component
  return onSnapshot(empCollection, (snapshot) => {
    const employeeData = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        EmployeeID: data.EmployeeID,
        Name: data.Name,
        Role: data.Role,
        Department: data.Department,
        Photo: data.Photo,
        // ✅ ADDED: Included the ContactNumber to be displayed in the table
        ContactNumber: data.ContactNumber, 
      };
    });

    dispatch(setEmployees(employeeData));
    dispatch(setLoading(false));
  }, (error) => {
    console.error("Firebase subscription error:", error);
    // You could dispatch an error action here if you had an error state
    dispatch(setLoading(false));
  });
};

export default attendanceSlice.reducer;