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
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(), // Generate random date within last 30 days
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
              {["Name", "Employee Id", "Date", "Time", "Status", "Remarks"].map(
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
                  {record.date}
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
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md">
    <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          📅 Event Details
        </h3>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-red-500 transition"
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

      {/* Content */}
      {selectedEvent && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <User size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Employee</p>
              <p className="font-medium text-gray-800">{selectedEvent.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
              <p className="font-medium text-gray-800">{selectedEvent.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
              <p className="font-medium text-gray-800">{selectedEvent.time}</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
            <span
              className={`mt-1 inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${getStatusClasses(
                selectedEvent.status
              )}`}
            >
              {selectedEvent.status}
            </span>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Remarks</p>
            <p className="font-medium text-gray-700 mt-1">{selectedEvent.remarks}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={closeModal}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
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