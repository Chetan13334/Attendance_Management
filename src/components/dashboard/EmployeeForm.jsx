import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../redux/slices/employeeSlice";
import { useNavigate } from "react-router-dom";
import leftArrow from "../assets/BackButton3.png";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // 👁️ for password toggle

const EmployeeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState(
    "https://placehold.co/160x160/cbd5e1/000?text=P"
  );

  const [showPassword, setShowPassword] = useState(false); // 👁 toggle state

  const [formData, setFormData] = useState({
    Name: "",
    Gender: "",
    ContactNumber: "",
    DateOfJoining: "",
    DateOfBirth: "",
    EmployeeID: "",
    Role: "",
    Department: "",
    Email: "",
    Password: "",
  });

  const loading = useSelector((state) => state.employees.loading);

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

    if (
      !formData.Name ||
      !formData.EmployeeID ||
      !formData.Email ||
      !formData.Password
    ) {
      alert("Please fill in all required fields: Name, Employee ID, Email, and Password.");
      return;
    }

    try {
      const employeeData = {
        ...formData,
        Photo: photo,
      };

      const resultAction = await dispatch(createEmployee(employeeData));

      if (createEmployee.fulfilled.match(resultAction)) {
        alert("✅ Employee added successfully!");
        setFormData({
          Name: "",
          Gender: "",
          ContactNumber: "",
          DateOfJoining: "",
          DateOfBirth: "",
          EmployeeID: "",
          Role: "",
          Department: "",
          Email: "",
          Password: "",
        });
        setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
        navigate("/employee_details");
      } else {
        alert("❌ Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("EmployeeForm error:", error);
      alert("❌ An unexpected error occurred.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 z-10 p-2 hover:scale-105 transition-transform duration-200"
      >
        <img src={leftArrow} alt="Back" className="w-8 h-8" />
      </button>

      <div className="w-full max-w-5xl bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
        <div className="mb-8 border-b pb-4 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Add New Employee</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the employee details below to register a new team member.
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          <div className="grid sm:grid-cols-12 gap-x-12 gap-y-5">
            {/* Profile Photo */}
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

            {/* Full Name */}
            <div className="sm:col-span-3">
              <label htmlFor="Name" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Full Name
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Name"
                value={formData.Name}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-3">
              <label htmlFor="Email" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Email
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Email"
                value={formData.Email}
                onChange={handleChange}
                type="email"
                placeholder="john.doe@example.com"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {/* Password with 👁 toggle */}
            <div className="sm:col-span-3">
              <label htmlFor="Password" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Password
              </label>
            </div>
            <div className="sm:col-span-9 relative w-full max-w-sm">
              <input
                id="Password"
                value={formData.Password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full px-4 py-2 pr-10 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
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
                    checked={formData.Gender === genderOption}
                    onChange={handleGenderChange}
                    className="form-radio size-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  {genderOption}
                </label>
              ))}
            </div>

            {/* Contact Number */}
            <div className="sm:col-span-3">
              <label htmlFor="ContactNumber" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Contact Number
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="ContactNumber"
                value={formData.ContactNumber}
                onChange={handleChange}
                type="text"
                placeholder="+91 98765 43210"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Joining */}
            <div className="sm:col-span-3">
              <label htmlFor="DateOfJoining" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Date of Joining
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfJoining"
                value={formData.DateOfJoining}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Birth */}
            <div className="sm:col-span-3">
              <label htmlFor="DateOfBirth" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Date of Birth
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Employee ID */}
            <div className="sm:col-span-3">
              <label htmlFor="EmployeeID" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Employee ID
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="EmployeeID"
                value={formData.EmployeeID}
                onChange={handleChange}
                type="text"
                placeholder="EMP12345"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {/* Role */}
            <div className="sm:col-span-3">
              <label htmlFor="Role" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Role
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Role"
                value={formData.Role}
                onChange={handleChange}
                type="text"
                placeholder="Software Engineer"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Department */}
            <div className="sm:col-span-3">
              <label htmlFor="Department" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Department
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Department"
                value={formData.Department}
                onChange={handleChange}
                type="text"
                placeholder="IT"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
