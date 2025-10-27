import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

const Employee_Details = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Real-time listener for Firestore data
    const unsubscribe = onSnapshot(collection(db, "Employee_Details"), 
      (snapshot) => {
        console.log("Employee_Details: Received snapshot");
        const list = snapshot.docs.map((doc) => {
          console.log("Employee_Details: Document data:", doc.id, doc.data());
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        console.log("Employee_Details: Processed list:", list);
        setEmployees(list);
      },
      (error) => {
        console.error("Employee_Details: Error fetching data:", error);
      }
    );

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Employee Details
        </h2>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Photo",
                    "Employee ID",
                    "Name",
                    "Gender",
                    "Department",
                    "Role",
                    "Contact",
                    "Date Of Joining",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
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
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4">
                      {emp.PhotoURL ? (
                        <img
                          src={emp.PhotoURL}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* Corrected Employee ID field */}
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {emp.EmployeeID || emp.employeeId || emp.id || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {emp.Name || emp.name || emp.displayName || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {emp.Gender || emp.gender || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {emp.Department || emp.department || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {emp.Role || emp.role || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {emp.ContactNumber || emp.contactNumber || emp.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {emp.DateOfJoining || emp.dateOfJoining || "-"}
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