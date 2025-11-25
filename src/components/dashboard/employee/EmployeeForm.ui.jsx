import React from "react";
import { ArrowLeft, EyeIcon, EyeOffIcon, User, Briefcase, Calendar, Phone } from "lucide-react";

const EmployeeFormUI = ({
  photo,
  showPassword,
  formData,
  loading,
  setShowPassword,
  handlePhotoChange,
  handleChange,
  handleGenderChange,
  handleSubmit,
  navigate
}) => {
  return (
    <div className="">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-7xl mx-auto flex flex-col bg-white h-[85vh] overflow-hidden">
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col h-full">
          <div className="p-6 bg-white text-gray-900 flex-shrink-0 flex justify-between items-center border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold">Add New Employee</h2>
              <p className="text-sm text-gray-500">Fill in the details to register a new team member.</p>
            </div>
          </div>

          <div className="flex-grow flex h-full overflow-hidden">
            <div className="w-1/4 flex-shrink-0 p-8 bg-gray-50 border-r border-gray-200 flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center space-y-4">
                {photo ? (
                  <img
                    className="w-28 h-28 rounded-full ring-4 ring-indigo-500 object-cover shadow-lg"
                    src={photo}
                    alt="Employee Avatar"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full ring-4 ring-indigo-500 shadow-lg bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-xs font-semibold">Add Photo</span>
                  </div>
                )}

                <label className="cursor-pointer py-2 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg shadow-sm hover:bg-indigo-100 transition text-sm font-semibold">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>

              <div className="w-full space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Name</p>
                    <p className="text-gray-800 font-semibold">{formData.Name || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Briefcase className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Employee ID</p>
                    <p className="text-gray-800 font-semibold">{formData.EmployeeID || "N/A"}</p>
                  </div>
                </div>

                {/* <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Joining</p>
                    <p className="text-gray-800 font-semibold">{formData.DateOfJoining || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Contact</p>
                    <p className="text-gray-800 font-semibold">{formData.ContactNumber || "N/A"}</p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="w-3/4 flex-grow p-8 overflow-y-auto space-y-8">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Employee Details</h3>

              <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    id="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    id="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative w-full">
                    <input
                      id="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                  <div className="flex gap-6 items-center pt-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.Gender === g}
                          onChange={handleGenderChange}
                          className="form-radio size-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                  <input
                    id="ContactNumber"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    type="text"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Date of Joining</label>
                  <input
                    id="DateOfJoining"
                    value={formData.DateOfJoining}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    id="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Employee ID</label>
                  <input
                    id="EmployeeID"
                    value={formData.EmployeeID}
                    onChange={handleChange}
                    type="text"
                    placeholder="EMP12345"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    id="Role"
                    value={formData.Role || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select Role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Fullstack Developer">Fullstack Developer</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    id="Department"
                    value={formData.Department || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/employee_details")}
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormUI;
