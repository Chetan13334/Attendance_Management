import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Employee_Details = () => {
  const [employees, setEmployees] = useState([]);

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
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Employee Details
        </h2>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No employees added yet.
          </p>
        ) : (
          <div className="rounded-xl shadow-lg border border-gray-200">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <tr>
                  {[
                    "Photo",
                    "Employee ID",
                    "Name",
                    "Gender",
                    "Department",
                    "Role",
                    "Contact",
                    "Joining Date",
                    "Date of Birth",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition duration-300"
                  >
                    <td className="px-4 py-3">
                      {emp.Photo ? (
                        <img
                          src={emp.Photo}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                      {emp.EmployeeID || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                      {emp.Name || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {emp.Gender || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {emp.Department || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {emp.Role || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {emp.ContactNumber || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {emp.DateOfJoining || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {emp.DateOfBirth || "-"}
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
