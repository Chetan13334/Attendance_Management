import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path
import { Search, Calendar, Clock, User } from "lucide-react";

const DUMMY_RECORDS = [
  { time: "09:05 AM", status: "Present", remarks: "On time" },
  { time: "09:12 AM", status: "Late", remarks: "5 min late" },
  { time: "-", status: "Absent", remarks: "Not marked" },
  { time: "09:00 AM", status: "Present", remarks: "Perfect" },
  { time: "09:10 AM", status: "Late", remarks: "Slight delay" },
  { time: "09:03 AM", status: "Present", remarks: "On time" },
  { time: "-", status: "Absent", remarks: "Leave applied" },
  { time: "08:59 AM", status: "Present", remarks: "Early" },
  { time: "09:06 AM", status: "Present", remarks: "On time" },
  { time: "09:02 AM", status: "Present", remarks: "Good" },
  { time: "-", status: "Absent", remarks: "No info" },
  { time: "09:15 AM", status: "Late", remarks: "Traffic" },
  { time: "09:00 AM", status: "Present", remarks: "Excellent" },
  { time: "09:07 AM", status: "Present", remarks: "Good" },
];

const getStatusClasses = (status) => {
  if (status === "Present") return "bg-green-100 text-green-800";
  if (status === "Absent") return "bg-red-100 text-red-800";
  if (status === "Late") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

function AttendanceTable() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Employee_Details"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Make sure we get plain string values
          const name = typeof data.Name === "string" ? data.Name : data.Name?.toString() || "";
          const id =
            typeof data.EmployeeID === "string"
              ? data.EmployeeID
              : data.EmployeeID?.toString() || "";

          return { id, name };
        });

        setEmployees(list);
      }
    );

    return () => unsubscribe();
  }, []);

  // Merge Firestore employees with dummy data
  const mergedRecords = employees.map((emp, index) => {
    const dummy = DUMMY_RECORDS[index] || {
      time: "-",
      status: "Absent",
      remarks: "Not marked",
    };
    return {
      id: emp.id,
      name: emp.name,
      ...dummy,
    };
  });

  // Function to handle event card click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-100 flex-wrap">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Today's Records
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Employee Id", "Time", "Status", "Remarks"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mergedRecords.map((record, index) => (
              <tr
                key={record.id || index}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      record.status
                    )} cursor-pointer`}
                    onClick={() => handleEventClick(record)}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for event details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Event Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Employee</p>
                    <p className="font-medium">{selectedEvent.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedEvent.time}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(
                      selectedEvent.status
                    )}`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500">Remarks</p>
                  <p className="font-medium">{selectedEvent.remarks}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceTable;