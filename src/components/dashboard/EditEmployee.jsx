import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../assets/left-arrow.png"; // ✅ Added this import

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [photo, setPhoto] = useState(
    "https://placehold.co/160x160/cbd5e1/000?text=P"
  );

  useEffect(() => {
    const fetchEmployee = async () => {
      const empRef = doc(db, "Employee_Details", id);
      const empSnap = await getDoc(empRef);
      if (empSnap.exists()) {
        const data = empSnap.data();
        setEmployee(data);
        if (data.Photo) setPhoto(data.Photo);
      }
    };
    fetchEmployee();
  }, [id]);

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
    setEmployee((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (e) => {
    setEmployee((prev) => ({ ...prev, Gender: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const empRef = doc(db, "Employee_Details", id);
    await updateDoc(empRef, { ...employee, Photo: photo });
    alert("✅ Employee details updated successfully!");
    navigate("/employee_details");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      await deleteDoc(doc(db, "Employee_Details", id));
      alert("🗑️ Employee removed successfully!");
      navigate("/employee_details");
    }
  };

  if (!employee)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      {/* ✅ Back Button (Added only this) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 z-10  p-2 hover:scale-105 transition-transform duration-200 "
      >
        <img src={leftArrow} alt="Back" className="w-8 h-8" />
      </button>

      <div className="w-full max-w-5xl bg-white rounded-2xl p-10">
        <div className="mb-8 border-b pb-4 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Edit Employee</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the employee details below and save changes.
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/160x160/cbd5e1/000?text=P";
                }}
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
              <label
                htmlFor="Name"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Full Name
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Name"
                value={employee.Name || ""}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-3">
              <label className="text-sm font-semibold text-gray-700 mt-2.5 block">
                Gender
              </label>
            </div>
            <div className="sm:col-span-9 flex gap-6">
              {["Male", "Female", "Other"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={employee.Gender === gender}
                    onChange={handleGenderChange}
                    className="form-radio size-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  {gender}
                </label>
              ))}
            </div>

            {/* Contact Number */}
            <div className="sm:col-span-3">
              <label
                htmlFor="ContactNumber"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Contact Number
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="ContactNumber"
                value={employee.ContactNumber || ""}
                onChange={handleChange}
                type="text"
                placeholder="+91 98765 43210"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Joining */}
            <div className="sm:col-span-3">
              <label
                htmlFor="DateOfJoining"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Date of Joining
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfJoining"
                value={employee.DateOfJoining || ""}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Birth */}
            <div className="sm:col-span-3">
              <label
                htmlFor="DateOfBirth"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Date of Birth
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="DateOfBirth"
                value={employee.DateOfBirth || ""}
                onChange={handleChange}
                type="date"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Employee ID */}
            <div className="sm:col-span-3">
              <label
                htmlFor="EmployeeID"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Employee ID
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="EmployeeID"
                value={employee.EmployeeID || ""}
                onChange={handleChange}
                type="text"
                placeholder="EMP12345"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Role */}
            <div className="sm:col-span-3">
              <label
                htmlFor="Role"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Role
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Role"
                value={employee.Role || ""}
                onChange={handleChange}
                type="text"
                placeholder="Software Engineer"
                className="w-full max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Department */}
            <div className="sm:col-span-3">
              <label
                htmlFor="Department"
                className="text-sm font-semibold text-gray-700 mt-2.5 block"
              >
                Department
              </label>
            </div>
            <div className="sm:col-span-9">
              <input
                id="Department"
                value={employee.Department || ""}
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
              className="px-6 py-2.5 rounded-xl text-green-600 font-medium hover:bg-green-400 hover:text-white shadow-lg transition duration-150"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2.5 rounded-xl bg-white text-red-600 font-medium hover:bg-red-400 hover:text-white shadow-lg transition duration-150"
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
