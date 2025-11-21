import React from "react";
import { getRoleColor, getGenderColor } from "./useEmployeeDetailsData";
import { SkeletonLoader } from "../../common/skeleton/Skeleton";

// --- Helper components (MOVED FROM MAIN COMPONENT) ---

const RolePill = ({ role }) => {
  const className = `px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getRoleColor(
    role
  )}`;
  return <span className={className}>{role || "N/A"}</span>;
};

const GenderPill = ({ gender }) => {
  const className = `px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getGenderColor(
    gender
  )}`;
  return <span className={className}>{gender || "N/A"}</span>;
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white py-10 px-4 overflow-x-hidden">
    <h2 className="text-2xl font-bold text-gray-800 mb-8 inline-block pb-1">
      Employee Details
    </h2>

    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-none">
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <SkeletonLoader type="employeeTable" rows={8} />
        </div>
      </div>
    </div>
  </div>
);

const EmployeeDetailsUI = ({ employees, loading, error, navigate }) => {
  if (loading)
    return <LoadingSkeleton />;

  if (error)
    return <p className="text-center mt-10 text-red-500">Error fetching data: {error}</p>;

  return (
    <div className="min-h-screen bg-white py-10 px-4 overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 inline-block pb-1">
        Employee Details
      </h2>

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-none">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-10">
            No employees added yet.
          </p>
        ) : (
          <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-[15px] whitespace-nowrap">
                <thead className="bg-white text-gray-500 font-semibold uppercase tracking-wider text-left">
                  <tr>
                    {[
                      "Photo",
                      "Emp ID",
                      "Name",
                      "Gender",
                      "Dept",
                      "Role",
                      "Contact",
                      "Join Date",
                      "DOB",
                      "Action",
                    ].map((header, index) => (
                      <th
                        key={header}
                        className={`px-4 py-3 font-medium text-[13px] whitespace-nowrap border-b border-gray-200 
                          ${index === 3 || index === 5 ? "text-center" : ""}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="text-gray-800 odd:bg-gray-50 hover:bg-gray-100 transition duration-150"
                    >
                      <td className="px-4 py-4">
                        {emp.Photo ? (
                          <img
                            src={emp.Photo}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x160/cbd5e1/000?text=P"; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            N/A
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">{emp.EmployeeID || "-"}</td>
                      <td className="px-4 py-4">{emp.Name || "-"}</td>

                      <td className="px-4 py-4 text-center">
                        <GenderPill gender={emp.Gender} />
                      </td>

                      <td className="px-4 py-4">{emp.Department || "-"}</td>

                      <td className="px-4 py-4 text-center">
                        <RolePill role={emp.Role} />
                      </td>

                      <td className="px-4 py-4">{emp.ContactNumber || "-"}</td>
                      <td className="px-4 py-4">{emp.DateOfJoining ? new Date(emp.DateOfJoining).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}</td>
                      <td className="px-4 py-4">{emp.DateOfBirth ? new Date(emp.DateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}</td>

                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => navigate(`/edit-employee/${emp.id}`)}
                          className="text-blue-600 text-sm font-medium hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsUI;