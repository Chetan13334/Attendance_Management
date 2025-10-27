import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const Employee_Details = () => {
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedEmployees, setEditedEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Employee_Details"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(list);
      setEditedEmployees(list);
    });

    return () => unsubscribe();
  }, []);

  // Handle input change
  const handleInputChange = (id, field, value) => {
    setEditedEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    try {
      for (let emp of editedEmployees) {
        const empRef = doc(db, "Employee_Details", emp.id);
        await updateDoc(empRef, {
          EmployeeID: emp.EmployeeID,
          Name: emp.Name,
          Gender: emp.Gender,
          Department: emp.Department,
          Role: emp.Role,
          ContactNumber: emp.ContactNumber,
          DateOfJoining: emp.DateOfJoining,
          DateOfBirth: emp.DateOfBirth,
        });
      }
      setEmployees(editedEmployees);
      setEditMode(false);
      alert("✅ Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className="min-h-screen rounded-3xl shadow-2xl bg-white py-10 px-4">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Employee Details
      </h2>

      <div className="max-w-7xl mx-auto bg-white p-8">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No employees added yet.</p>
        ) : (
          <div className="rounded-3xl shadow-2xl border border-gray-200">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
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
                {editedEmployees.map((emp) => (
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

                    {[
                      "EmployeeID",
                      "Name",
                      "Gender",
                      "Department",
                      "Role",
                      "ContactNumber",
                      "DateOfJoining",
                      "DateOfBirth",
                    ].map((field) => (
                      <td
                        key={field}
                        className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap"
                      >
                        {editMode ? (
                          <input
                            type="text"
                            value={emp[field] || ""}
                            onChange={(e) =>
                              handleInputChange(emp.id, field, e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          emp[field] || "-"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              ✏️ Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => {
                  setEditedEmployees(employees);
                  setEditMode(false);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee_Details;
