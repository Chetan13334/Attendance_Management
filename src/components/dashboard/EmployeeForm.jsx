import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Back_Button from "../assets/BackButton.png";
import { useNavigate } from "react-router-dom";

const EmployeeForm = () => {
  const navigate = useNavigate();

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

    try {
      console.log("EmployeeForm: Attempting to add employee with data:", {
        ...formData,
        Photo: photo,
      });

      const docRef = await addDoc(collection(db, "Employee_Details"), {
        ...formData,
        Photo: photo,
        createdAt: new Date(), // Add timestamp
      });

      console.log(
        "EmployeeForm: Employee added successfully with ID:",
        docRef.id
      );
      alert("✅ Employee added successfully!");

      setFormData({
        Name: "",
        Gender: "",
        ContactNumber: "",
        DateOfJoining: "",
        EmployeeID: "",
        Role: "",
        Department: "",
      });
      setPhoto("https://placehold.co/160x160/cbd5e1/000?text=P");
    } catch (error) {
      console.error("EmployeeForm: Error adding employee:", error);
      alert("❌ Failed to add employee. Check console for details.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">

      <div className="w-full max-w-5xl bg-white rounded-2xl p-10">
        <div className="mb-8 border-b pb-4 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Add Employee</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the employee details below to register a new team member.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.Name}
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
                    checked={formData.Gender === gender}
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
                value={formData.ContactNumber}
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
                value={formData.DateOfJoining}
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
                value={formData.DateOfBirth}
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
                value={formData.EmployeeID}
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
                value={formData.Role}
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
              className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-green-600 font-medium hover:bg-green-400 hover:text-white shadow-lg transition duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
