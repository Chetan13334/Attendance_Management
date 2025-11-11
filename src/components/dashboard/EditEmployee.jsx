import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateEmployeeAsync,
  deleteEmployeeAsync,
  clearCurrentEmployee,
} from "../../redux/slices/employeeSlice";
import leftArrow from "../assets/BackButton3.png";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // 👁 for toggle icons

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.list);
  const loading = useSelector((state) => state.employees.loading);

  const [formData, setFormData] = useState(null);
  const [photo, setPhoto] = useState("https://placehold.co/160x160/cbd5e1/000?text=P");
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle state

  useEffect(() => {
    const selected = employees.find((emp) => emp.id === id);
    if (selected) {
      setFormData(selected);
      if (selected.Photo) setPhoto(selected.Photo);
    }
    return () => dispatch(clearCurrentEmployee());
  }, [id, employees, dispatch]);

  if (!formData)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setPhoto(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, Gender: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData, Photo: photo };
    const result = await dispatch(
      updateEmployeeAsync({ id: formData.id, updatedData })
    );
    if (updateEmployeeAsync.fulfilled.match(result)) {
      alert("✅ Employee updated successfully!");
      navigate("/employee_details");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    const result = await dispatch(deleteEmployeeAsync(formData.id));
    if (deleteEmployeeAsync.fulfilled.match(result)) {
      alert("🗑️ Employee deleted.");
      navigate("/employee_details");
    }
  };

  const {
    Name,
    Gender,
    ContactNumber,
    DateOfJoining,
    DateOfBirth,
    EmployeeID,
    Role,
    Department,
    Email,
    Password,
  } = formData;

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
          <h2 className="text-3xl font-bold text-gray-800">Edit Employee</h2>
          <p className="text-sm text-gray-500 mt-1">
            Modify details and save changes for {Name}.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
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
                Change Photo
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
                value={Name || ""}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                value={Email || ""}
                onChange={handleChange}
                type="email"
                placeholder="john.doe@example.com"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password with eye toggle 👁 */}
            <div className="sm:col-span-3">
              <label htmlFor="Password" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Password
              </label>
            </div>
            <div className="sm:col-span-9 relative w-full max-w-sm">
              <input
                id="Password"
                value={Password || ""}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
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
              <label htmlFor="ContactNumber" className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Contact Number
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="ContactNumber"
                value={ContactNumber || ""}
                onChange={handleChange}
                type="text"
                placeholder="+91 98765 43210"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                value={DateOfJoining || ""}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                value={DateOfBirth || ""}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                value={EmployeeID || ""}
                onChange={handleChange}
                type="text"
                placeholder="EMP12345"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                value={Role || ""}
                onChange={handleChange}
                type="text"
                placeholder="Software Engineer"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                value={Department || ""}
                onChange={handleChange}
                type="text"
                placeholder="IT"
                autoComplete="off"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-indigo-700 shadow-lg transition duration-150 disabled:bg-indigo-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg transition duration-150"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
