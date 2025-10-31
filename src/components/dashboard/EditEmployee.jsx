import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // ✅ Added Redux imports
import { useParams, useNavigate } from "react-router-dom";
import { 
  fetchEmployeeById, 
  updateEmployeeAsync, 
  deleteEmployeeAsync,
  updateCurrentEmployeeField, // ✅ To handle local form field changes
  clearCurrentEmployee // ✅ To clean up state on unmount
} from "../../redux/slices/employeeSlice"; 
import leftArrow from "../assets/BackButton3.png"; 

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Use Redux state as the source of truth
  const employee = useSelector(state => state.employees.currentEmployee);
  const loading = useSelector(state => state.employees.loading);
  const error = useSelector(state => state.employees.error);

  // We keep local 'photo' state for the FileReader handling
  const [photo, setPhoto] = useState(
    "https://placehold.co/160x160/cbd5e1/000?text=P"
  );

  useEffect(() => {
    // 1. Fetch employee data using Redux Thunk when the ID changes
    dispatch(fetchEmployeeById(id)); 

    // 2. Cleanup: clear currentEmployee state when component unmounts
    return () => {
        dispatch(clearCurrentEmployee());
    }
  }, [id, dispatch]);

 // 3. Update local photo state when Redux employee data arrives
 useEffect(() => {
    if (employee && employee.Photo && employee.Photo !== photo) {
        setPhoto(employee.Photo);
    }
 }, [employee]);


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    // ✅ Dispatch a simple reducer action to update the form field in Redux state
    // This keeps the form data synchronous with Redux without saving to Firebase yet.
    const { id: field, value } = e.target;
    dispatch(updateCurrentEmployeeField({ field, value }));
  };

  const handleGenderChange = (e) => {
    // ✅ Dispatch a simple reducer action for gender
    dispatch(updateCurrentEmployeeField({ field: 'Gender', value: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!employee) return; 

    // Create the final updated data object, ensuring the photo is included
    const updatedData = { ...employee, Photo: photo };

    // Destructure the employee object to get only the updateable fields (excluding ID)
    const { id, ...dataToUpdate } = updatedData;

    // ✅ Dispatch Redux Thunk to update employee
    const resultAction = await dispatch(updateEmployeeAsync({ 
        id: employee.id, 
        updatedData: dataToUpdate // Pass the clean data object
    }));
    
    if(updateEmployeeAsync.fulfilled.match(resultAction)) {
        alert("✅ Employee details updated successfully!");
        navigate("/employee_details");
    } else {
        alert(`❌ Failed to update employee: ${resultAction.error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${employee?.Name}? This action cannot be undone.`)) {
        // ✅ Dispatch Redux Thunk to delete employee
        const resultAction = await dispatch(deleteEmployeeAsync(employee.id));
        
        if(deleteEmployeeAsync.fulfilled.match(resultAction)) {
            alert("🗑️ Employee removed successfully!");
            navigate("/employee_details");
        } else {
            alert(`❌ Failed to delete employee: ${resultAction.error.message || 'Unknown error'}`);
        }
    }
  };

  // --- Loading and Error States ---
  if (loading && !employee) 
    return <p className="text-center mt-10 text-gray-500">Loading employee details...</p>;
    
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}. Could not load employee.</p>;
    
  if (!employee)
    return <p className="text-center mt-10 text-red-500">Employee not found.</p>;

  // Destructure employee from the Redux state for simpler JSX access
  const { Name, ContactNumber, DateOfJoining, DateOfBirth, EmployeeID, Role, Department, Gender } = employee;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 z-10 p-2 hover:scale-105 transition-transform duration-200"
      >
        <img src={leftArrow} alt="Back" className="w-8 h-8" />
      </button>

      <div className="w-full max-w-5xl bg-white rounded-2xl p-10">
        <div className="mb-8 border-b pb-4 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Edit Employee: {Name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Updating record for Employee ID: **{EmployeeID}**
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid sm:grid-cols-12 gap-x-12 gap-y-5">
            {/* Profile Photo */}
            <div className="sm:col-span-3">
              <label className="text-sm font-semibold text-gray-700 mt-2.5 block">Profile Photo</label>
            </div>
            <div className="sm:col-span-9 flex items-center gap-5">
              <img
                className="w-16 h-16 rounded-full ring-2 ring-indigo-500 object-cover shadow-md"
                src={photo}
                alt="Employee Avatar"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x160/cbd5e1/000?text=P"; }}
              />
              <label className="cursor-pointer py-2 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg shadow-sm hover:bg-indigo-100 transition duration-150 text-sm font-medium">
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            {/* Full Name */}
            <div className="sm:col-span-3">
              <label htmlFor="Name" className="text-sm font-semibold text-gray-700 mt-2.5 block">Full Name</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Name"
                value={Name || ""}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-3">
              <label className="text-sm font-semibold text-gray-700 mt-2.5 block">Gender</label>
            </div>
            <div className="sm:col-span-9 flex gap-6">
              {["Male", "Female", "Other"].map((genderOption) => (
                <label key={genderOption} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption}
                    checked={Gender === genderOption}
                    onChange={handleGenderChange}
                    className="form-radio size-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  {genderOption}
                </label>
              ))}
            </div>
            
            {/* Contact Number */}
            <div className="sm:col-span-3">
              <label htmlFor="ContactNumber" className="text-sm font-semibold text-gray-700 mt-2.5 block">Contact Number</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="ContactNumber"
                value={ContactNumber || ""}
                onChange={handleChange}
                type="text"
                placeholder="+91 98765 43210"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Joining */}
            <div className="sm:col-span-3">
              <label htmlFor="DateOfJoining" className="text-sm font-semibold text-gray-700 mt-2.5 block">Date of Joining</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfJoining"
                value={DateOfJoining || ""}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Birth */}
            <div className="sm:col-span-3">
              <label htmlFor="DateOfBirth" className="text-sm font-semibold text-gray-700 mt-2.5 block">Date of Birth</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfBirth"
                value={DateOfBirth || ""}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Employee ID */}
            <div className="sm:col-span-3">
              <label htmlFor="EmployeeID" className="text-sm font-semibold text-gray-700 mt-2.5 block">Employee ID</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="EmployeeID"
                value={EmployeeID || ""}
                onChange={handleChange}
                type="text"
                placeholder="EMP12345"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Role */}
            <div className="sm:col-span-3">
              <label htmlFor="Role" className="text-sm font-semibold text-gray-700 mt-2.5 block">Role</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Role"
                value={Role || ""}
                onChange={handleChange}
                type="text"
                placeholder="Software Engineer"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Department */}
            <div className="sm:col-span-3">
              <label htmlFor="Department" className="text-sm font-semibold text-gray-700 mt-2.5 block">Department</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Department"
                value={Department || ""}
                onChange={handleChange}
                type="text"
                placeholder="IT"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/employee_details")}
              className="px-6 py-2.5 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-green-600 font-medium hover:bg-green-400 hover:text-white shadow-lg transition duration-150 disabled:bg-gray-200 disabled:text-gray-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-white text-red-600 font-medium hover:bg-red-400 hover:text-white shadow-lg transition duration-150 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Delete Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;