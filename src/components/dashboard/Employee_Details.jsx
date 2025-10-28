import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";


// --- Helper function to map roles to specific colors ---
const getRoleColor = (role) => {
  if (!role) return 'bg-gray-100 text-gray-700';
  
  const lowerCaseRole = role.toLowerCase().trim();

  if (lowerCaseRole.includes('frontend')) {
    return 'bg-yellow-100 text-yellow-700'; 
  } else if (lowerCaseRole.includes('backend')) {
    return 'bg-red-100 text-red-700';
  } else if (lowerCaseRole.includes('fullstack')) {
    return 'bg-purple-100 text-purple-700';
  } else if (lowerCaseRole.includes('software developer') || lowerCaseRole.includes('developer')) {
    return 'bg-green-100 text-green-700';
  } else if (lowerCaseRole.includes('manager')) {
    return 'bg-blue-100 text-blue-700';
  } else {
    return 'bg-indigo-100 text-indigo-700';
  }
};

const RolePill = ({ role }) => {
  const className = `px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getRoleColor(role)}`;
  return <span className={className}>{role || 'N/A'}</span>;
};

// --- Helper function for Gender color (Male/Female) ---
const getGenderColor = (gender) => {
  if (!gender) return 'bg-gray-100 text-gray-700';

  const lowerCaseGender = gender.toLowerCase().trim();

  if (lowerCaseGender === 'male') {
    return 'bg-sky-100 text-sky-700';
  } else if (lowerCaseGender === 'female') {
    return 'bg-pink-100 text-pink-700';
  } else {
    return 'bg-gray-200 text-gray-700'; 
  }
}

const GenderPill = ({ gender }) => {
    // We add 'flex justify-center' here to center the pill inside its cell
    const className = `px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getGenderColor(gender)}`;
    return <span className={className}>{gender || 'N/A'}</span>;
};


// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="text-lg text-gray-500 ml-4">Loading employee data...</p>
    </div>
);


const Employee_Details = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); 
  
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
        setLoading(false); 
      },
      (error) => {
          console.error("Error fetching employee details:", error);
          setLoading(false); 
      }
    );

    return () => unsubscribe();
  }, []);

  // --- Start of Component Return/Render ---
  return (
    <div className="min-h-screen bg-white py-10 px-4 overflow-x-hidden"> 
      
      <h2 className="text-2xl font-bold text-gray-800 mb-8 inline-block pb-1">
        Employee Details
      </h2>

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-none">
        
        {loading ? (
            <LoadingSpinner />
        ) : employees.length === 0 ? (
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
                    "Gender", // Index 3
                    "Dept",
                    "Role", // Index 5
                    "Contact",
                    "Join Date",
                    "DOB",
                    "Action",
                  ].map((header, index) => (
                    <th
                      key={header}
                      className={`px-4 py-3 font-medium text-[13px] whitespace-nowrap 
                        ${index === 0 ? 'rounded-tl-lg' : ''} 
                        ${index === 9 ? 'rounded-tr-lg' : ''} 
                        border-b border-gray-200 
                        
                        /* ADDED: Center alignment for Gender and Role headers */
                        ${index === 3 || index === 5 ? 'text-center' : ''} 
                      `}
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
                    {/* Photo */}
                    <td className="px-4 py-4"> 
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

                    {/* Emp ID */}
                    <td className="px-4 py-4 text-gray-700 font-medium">
                      {emp.EmployeeID || "-"}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-4 text-gray-800 font-medium">
                      {emp.Name || "-"}
                    </td>

                    {/* Gender - Cell centered to align with header */}
                    <td className="px-4 py-4 text-gray-600 text-center">
                      <div className="flex justify-center">
                        <GenderPill gender={emp.Gender} />
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="px-4 py-4 text-gray-600">
                      {emp.Department || "-"}
                    </td>

                    {/* Role - Cell centered to align with header */}
                    <td className="px-4 py-4 text-gray-600 text-center">
                       <div className="flex justify-center">
                          <RolePill role={emp.Role} />
                       </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4 text-gray-600">
                      {emp.ContactNumber || "-"}
                    </td>

                    {/* Join Date */}
                    <td className="px-4 py-4 text-gray-600">
                      {emp.DateOfJoining || "-"}
                    </td>

                    {/* DOB */}
                    <td className="px-4 py-4 text-gray-600">
                      {emp.DateOfBirth || "-"}
                    </td>

                    {/* Action (Edit Button) */}
                    <td className="px-4 py-4 text-center"> 
                      <button
                        onClick={() => navigate(`/edit-employee/${emp.id}`)}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 transition duration-150 "
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

export default Employee_Details;