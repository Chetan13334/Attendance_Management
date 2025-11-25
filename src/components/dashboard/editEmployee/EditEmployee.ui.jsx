  import React from "react";
  import { EyeIcon, EyeOffIcon, ArrowLeft, User, Briefcase, Calendar, Phone, Lock } from "lucide-react";

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <Icon className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-1" />
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase text-gray-400">{label}</span>
        <span className="text-base text-gray-800 font-semibold">{value || 'N/A'}</span>
      </div>
    </div>
  );

  const EditEmployeeUI = ({
    formData,
    photo,
    showPassword,
    loading,
    setShowPassword,
    handlePhotoChange,
    handleChange,
    handleGenderChange,
    handleSave,
    handleDelete,
    navigate
  }) => {
    if (!formData)
      return <p className="text-center mt-10 text-gray-500">Loading...</p>;

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

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date)) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
      <div className="">
        <div className="w-full max-w-7xl mx-auto flex flex-col bg-white h-[85vh] overflow-hidden">
          <form onSubmit={handleSave} className="flex flex-col h-full">
            <div className="p-6 bg-white text-gray-900 flex-shrink-0 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/employee_details")}
                  className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Employee Details</h2>
                  <p className="text-sm text-gray-500">Manage all employee personal and professional details.</p>
                </div>
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
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/112x112/4f46e5/ffffff?text=P" }}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full ring-4 ring-indigo-500 shadow-lg bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                      {Name ? Name.charAt(0).toUpperCase() : "E"}
                    </div>
                  )}
                  <label className="cursor-pointer py-2 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg shadow-sm hover:bg-indigo-100 transition duration-150 text-sm font-semibold">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="w-full space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Employee Snapshot</h3>
                  <DetailItem icon={User} label="Employee Name" value={Name} />
                  <DetailItem icon={Briefcase} label="Employee ID" value={EmployeeID} />
                </div>
              </div>

              <div className="w-3/4 flex-grow p-8 overflow-y-auto space-y-8">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Primary Details</h3>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                  {[
                    { id: "Name", label: "Full Name", type: "text", placeholder: "John Doe", value: Name },
                    { id: "Email", label: "Email Address", type: "email", placeholder: "john.doe@corp.io", value: Email },
                    { id: "ContactNumber", label: "Contact Number", type: "text", placeholder: "+91 98765 43210", value: ContactNumber },
                    { id: "EmployeeID", label: "Employee ID", type: "text", placeholder: "EMP12345", value: EmployeeID, disabled: false },
                  ].map(({ id, label, type, placeholder, value, disabled }) => (
                    <div key={id} className="flex flex-col">
                      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input
                        id={id}
                        name={id}
                        value={value || ""}
                        onChange={handleChange}
                        type={type}
                        placeholder={placeholder}
                        autoComplete="off"
                        disabled={disabled}
                        className={`w-full px-4 py-2.5 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 pt-4">Professional & Personal</h3>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                  {[
                    { id: "Role", label: "Role/Title", type: "text", placeholder: "Software Engineer", value: Role },
                    { id: "Department", label: "Department", type: "text", placeholder: "IT", value: Department },
                    { id: "DateOfJoining", label: "Date of Joining", type: "date", value: DateOfJoining },
                    { id: "DateOfBirth", label: "Date of Birth", type: "date", value: DateOfBirth },
                  ].map(({ id, label, type, placeholder, value }) => (
                    <div key={id} className="flex flex-col">
                      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input
                        id={id}
                        name={id}
                        value={value || ""}
                        onChange={handleChange}
                        type={type}
                        placeholder={placeholder}
                        autoComplete="off"
                        className="w-full px-4 py-2.5 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner text-sm"
                      />
                    </div>
                  ))}

                  <div className="flex flex-col">
                    <label htmlFor="Password" className="text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative w-full">
                      <input
                        id="Password"
                        name="Password"
                        value={Password || ""}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className="w-full px-4 py-2.5 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10 shadow-inner text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1"
                      >
                        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                    <div className="flex gap-6 items-center pt-2">
                      {["Male", "Female", "Other"].map((genderOption) => (
                        <label key={genderOption} className="flex items-center gap-2 text-gray-700 text-sm">
                          <input
                            type="radio"
                            name="Gender"
                            value={genderOption}
                            checked={Gender === genderOption}
                            onChange={handleGenderChange}
                            className="form-radio size-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          {genderOption}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-white border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
                disabled={loading}
              >
                <Lock className="inline w-3.5 h-3.5 mr-2 -mt-0.5" /> Delete Employee
              </button>

              <div className="flex gap-3">
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
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  };

  export default EditEmployeeUI;
