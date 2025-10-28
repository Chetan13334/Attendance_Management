import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination.jsx";

const Employee_Details = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Employee_Details"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(list);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-800 py-10 px-6 overflow-x-hidden">
      <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gray-500 leading-tight pb-2">
        Employee Details
      </h2>

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No employees added yet.
          </p>
        ) : (
          <div className="rounded-2xl overflow-x-auto">
            <table className="w-full border-collapse text-[15px] whitespace-nowrap">
              <thead className="bg-blue-500 text-white">
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
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 font-semibold text-left uppercase tracking-wider text-[13px]"
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
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition duration-200"
                  >
                    <td className="px-4 py-3">
                      {emp.Photo ? (
                        <img
                          src={emp.Photo}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {emp.EmployeeID || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {emp.Name || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.Gender || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.Department || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.Role || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.ContactNumber || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.DateOfJoining || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.DateOfBirth || "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigate(`/edit-employee/${emp.id}`)}
                        className="bg-white text-blue-600 border border-blue-500 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee_Details;