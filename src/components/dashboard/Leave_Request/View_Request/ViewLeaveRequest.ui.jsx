import React, { useState } from "react";
import ViewLeaveRequestTabs from "./ViewLeaveRequestTabs";
import { Download, Calendar, Clock, FileText, CheckCircle, XCircle, User, Briefcase, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewLeaveRequestUI = ({ data, onApprove, onReject, updatingStatus }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-700 ring-green-600/20";
      case "Rejected": return "bg-red-50 text-red-700 ring-red-600/20";
      default: return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    }
  };

  // Safe access to employee name
  const employeeName = data.employee?.name || "Unknown Employee";
  const employeeInitial = employeeName.charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl mx-10 space-y-6 pb-10">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        aria-label="Go back"
      >
        <ArrowLeft size={24} strokeWidth={2} />
      </button>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Request Details</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage employee leave request</p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ring-1 ${getStatusColor(data.status)}`}>
          <span className={`w-2 h-2 rounded-full ${data.status === "Approved" ? "bg-green-500" : data.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"}`}></span>
          <span className="text-sm font-semibold">{data.status}</span>
        </div>
      </div>

      {/* EMPLOYEE CARD */}
      <div className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

        {/* Avatar */}
        <div className="relative z-10">
          {data.employee?.photo ? (
            <img
              src={data.employee.photo}
              alt={employeeName}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-md border-4 border-white">
              {employeeInitial}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 text-center sm:text-left z-10">
          <h2 className="text-xl font-bold text-gray-900">{employeeName}</h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Briefcase size={14} /> {data.employee?.position || "Employee"}</span>
            <span className="hidden sm:inline">•</span>
            <span>{data.employee?.department || "Department"}</span>
          </div>

          <button
            className="group flex items-center gap-1 text-indigo-600 text-sm font-semibold mt-3 hover:text-indigo-700 transition-colors mx-auto sm:mx-0"
            onClick={() => navigate(`/edit-employee/${data.employee?.EmployeeID || data.employeeId}`)}
          >
            View Full Profile
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* CONTENT TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 pt-2">
          <ViewLeaveRequestTabs active={activeTab} setActive={setActiveTab} />
        </div>

        <div className="p-6 md:p-8">
          {/* TAB 0 — LEAVE DETAILS */}
          {activeTab === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* DETAIL GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Leave Type", value: data.leaveDetails.type, icon: FileText, color: "text-blue-600 bg-blue-50" },
                  { label: "Start Date", value: data.leaveDetails.startDate, icon: Calendar, color: "text-indigo-600 bg-indigo-50" },
                  { label: "End Date", value: data.leaveDetails.endDate, icon: Calendar, color: "text-purple-600 bg-purple-50" },
                  { label: "Total Days", value: data.leaveDetails.totalDays, icon: Clock, color: "text-orange-600 bg-orange-50" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <item.icon size={18} />
                      </div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-lg pl-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Reason */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" /> Reason for Leave
                </h3>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed relative">
                  <span className="absolute top-4 left-4 text-4xl text-gray-200 font-serif">"</span>
                  <p className="relative z-10 px-4 italic">{data.leaveDetails.reason}</p>
                </div>
              </div>

              {/* Document */}
              {data.leaveDetails.document && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Supporting Documents</h3>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {data.leaveDetails.document.name}
                        </p>
                        <p className="text-xs text-gray-500">{data.leaveDetails.document.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1 — REVIEW & ACTION */}
          {activeTab === 1 && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-5">
                Reviewer Comments <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="bg-gray-20 rounded-2xl p-4 shadow">

                <textarea
                  className="w-full bg-white   rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm  transition-shadow resize-none"
                  rows={4}
                  placeholder="Add context for your decision (e.g., 'Approved as per policy' or 'Rejected due to staffing shortage')..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                <button
                  onClick={onReject}
                  disabled={!!updatingStatus}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus === "Rejected" ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
                  Reject Request
                </button>

                <button
                  onClick={onApprove}
                  disabled={!!updatingStatus}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus === "Approved" ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  Approve Request
                </button>
              </div>
            </div>
          )}

          {/* TAB 2 — EMPLOYEE HISTORY */}
          {activeTab === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Leave Balance", data: data.employeeHistory.leaveBalance, keys: ["annual", "sick", "personal"] },
                  { title: "Attendance (YTD)", data: data.employeeHistory.attendanceSummary, keys: ["worked", "late", "unexcused"] },
                  { title: "Requests (Year)", data: data.employeeHistory.requestsThisYear, keys: ["submitted", "approved", "rejected"] },
                ].map((card, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{card.title}</h3>
                    <div className="space-y-3">
                      {card.keys.map((key) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 capitalize">{key}</span>
                          <span className={`font-semibold px-2 py-0.5 rounded-md ${key === "unexcused" || key === "rejected" ? "bg-red-50 text-red-700" :
                            key === "approved" ? "bg-green-50 text-green-700" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                            {card.data[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent History Table */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Recent Leave History</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                      <tr>
                        {["Leave Type", "Dates", "Days", "Status"].map((h) => (
                          <th key={h} className="py-3 px-6 text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.employeeHistory.recentHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 font-medium text-gray-900">{item.type}</td>
                          <td className="px-6 text-gray-600">{item.dates}</td>
                          <td className="px-6 text-gray-600">{item.days}</td>
                          <td className="px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "Approved" ? "bg-green-50 text-green-700" :
                              item.status === "Rejected" ? "bg-red-50 text-red-700" :
                                "bg-yellow-50 text-yellow-700"
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Approved" ? "bg-green-500" :
                                item.status === "Rejected" ? "bg-red-500" :
                                  "bg-yellow-500"
                                }`}></span>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default ViewLeaveRequestUI;
