import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added Redux imports
import { createEmployee } from "../../redux/slices/employeeSlice"; // ✅ Import the creation thunk
import { useNavigate } from "react-router-dom";
// Assuming you have an asset path for the back button
import leftArrow from "../assets/BackButton3.png"; 

const EmployeeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState(
    "https://placehold.co/160x160/cbd5e1/000?text=P"
  );
    
  const [formData, setFormData] = useState({ 
    Name: "",
    Gender: "",
    ContactNumber: "",
    DateOfJoining: "",
    DateOfBirth: "",
    EmployeeID: "",
    Role: "",
    Department: "",
  });
    
  // Check loading state from Redux (optional, but good practice)
  const loading = useSelector(state => state.employees.loading); 

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, Gender: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.Name || !formData.EmployeeID) {
        alert("Please fill in at least the Name and Employee ID.");
        return;
    }

    try {
        const employeeData = {
            ...formData,
            Photo: photo,
        };
        
        // ✅ Dispatch the Redux Thunk
        const resultAction = await dispatch(createEmployee(employeeData)); 

        // Check if the thunk successfully created the employee
        if (createEmployee.fulfilled.match(resultAction)) {
            alert("✅ Employee added successfully!");

            // Clear the form after submission
            setFormData({
                Name: "", Gender: "", ContactNumber: "", DateOfJoining: "", 
                DateOfBirth: "", EmployeeID: "", Role: "", Department: "",
            });
            setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
            
            // Redirect to the employee list or homepage
            navigate("/employee_details"); 

        } else {
            // Error handling for failed thunk (e.g., Firebase permissions issue)
            alert("❌ Failed to add employee. Please try again.");
            console.error(resultAction.error.message);
        }
    } catch (error) {
      console.error("EmployeeForm: Unexpected error during submission:", error);
      alert("❌ An unexpected error occurred.");
    }
  };

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
          <h2 className="text-3xl font-bold text-gray-800">Add New Employee</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the employee details below to register a new team member.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-12 gap-x-12 gap-y-5">
            
            {/* Profile Photo Section (Same as before) */}
            <div className="sm:col-span-3">
              <label className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Profile Photo
              </label>
            </div>
            <div className="sm:col-span-9 flex items-center gap-5">
              <img
                className="w-16 h-16 rounded-full ring-2 ring-indigo-500 object-cover shadow-md"
                src={photo}
                alt="Employee Avatar"
              />
              <label className="cursor-pointer py-2 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg shadow-sm hover:bg-indigo-100 transition duration-150 text-sm font-medium">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            
            {/* Name Input */}
            <div className="sm:col-span-3">
              <label htmlFor="Name" className="text-sm font-semibold text-gray-700 mt-2.5 block">Full Name</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Name"
                value={formData.Name}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {/* Gender Radio Buttons */}
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
                    checked={formData.Gender === genderOption}
                    onChange={handleGenderChange}
                    className="form-radio size-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  {genderOption}
                </label>
              ))}
            </div>

            {/* Contact Number Input */}
            <div className="sm:col-span-3">
              <label htmlFor="ContactNumber" className="text-sm font-semibold text-gray-700 mt-2.5 block">Contact Number</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="ContactNumber"
                value={formData.ContactNumber}
                onChange={handleChange}
                type="text"
                placeholder="+91 98765 43210"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date Inputs (DOJ, DOB) */}
            <div className="sm:col-span-3">
              <label htmlFor="DateOfJoining" className="text-sm font-semibold text-gray-700 mt-2.5 block">Date of Joining</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfJoining"
                value={formData.DateOfJoining}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="DateOfBirth" className="text-sm font-semibold text-gray-700 mt-2.5 block">Date of Birth</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Employee ID Input */}
            <div className="sm:col-span-3">
              <label htmlFor="EmployeeID" className="text-sm font-semibold text-gray-700 mt-2.5 block">Employee ID</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="EmployeeID"
                value={formData.EmployeeID}
                onChange={handleChange}
                type="text"
                placeholder="EMP12345"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {/* Role Input */}
            <div className="sm:col-span-3">
              <label htmlFor="Role" className="text-sm font-semibold text-gray-700 mt-2.5 block">Role</label>
              </div>
            <div className="sm:col-span-9">
              <input
                id="Role"
                value={formData.Role}
                onChange={handleChange}
                type="text"
                placeholder="Software Engineer"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Department Input */}
            <div className="sm:col-span-3">
              <label htmlFor="Department" className="text-sm font-semibold text-gray-700 mt-2.5 block">Department</label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Department"
                value={formData.Department}
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
              disabled={loading} // Disable while loading/saving
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg transition duration-150 disabled:bg-indigo-300"
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;