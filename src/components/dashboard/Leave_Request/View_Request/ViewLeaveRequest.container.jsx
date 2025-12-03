import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { subscribeToLeaveRequests, updateLeaveStatus } from "../../../../redux/slices/leaveSlice";
import { formatDate } from "../../../../utils/dateUtils";
import ViewLeaveRequestUI from "./ViewLeaveRequest.ui";
import { SkeletonLoader } from "../../../common/skeleton/Skeleton";
import { usePopupContext } from "../../../common/popups/PopupProvider";

/**
 * Container component for View Leave Request Detail page
 * 
 * Real-time behavior:
 * - Sets up Firestore listener for ALL leave requests
 * - Filters to show specific employee's requests
 * - When status is updated (Approve/Reject):
 *   1. updateLeaveStatus updates Firestore
 *   2. onSnapshot listener detects the change
 *   3. Redux state updates automatically
 *   4. Component re-renders with new status
 *   5. UI shows updated status badge - NO refresh needed!
 */
const ViewLeaveRequestContainer = () => {
  const { id } = useParams(); // This is now the leave request PATH (URL-encoded)
  const dispatch = useDispatch();
  const [updatingStatus, setUpdatingStatus] = useState(null); // 'Approved' | 'Rejected' | null
  const { showToast, showConfirm } = usePopupContext();

  const { list: leaves, loading } = useSelector((state) => state.leaves);
  const { list: employees } = useSelector((state) => state.employees);

  // 🔥 Set up real-time listener - runs ONCE on mount
  useEffect(() => {
    const unsubscribe = subscribeToLeaveRequests()(dispatch);

    // Cleanup function - removes listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]); // Only dispatch in dependency array

  if (loading && leaves.length === 0) {
    return <div className="p-10"><SkeletonLoader type="table" rows={5} /></div>;
  }

  // Decode the path from URL (it was encoded to be URL-safe)
  const decodedPath = decodeURIComponent(id);

  // Find the SPECIFIC leave request by its unique path
  const selectedRequest = leaves.find((leave) => leave.path === decodedPath);

  if (!selectedRequest) {
    return <div className="p-10 text-center text-gray-500">Leave request not found.</div>;
  }

  // Find the employee for this leave request
  const employee = employees.find(
    (emp) =>
      String(emp.EmployeeID) === String(selectedRequest.EmployeeID) ||
      String(emp.id) === String(selectedRequest.EmployeeID)
  );

  // Get all requests for this employee (for history section)
  const employeeRequests = leaves.filter(
    (leave) => String(leave.EmployeeID) === String(selectedRequest.EmployeeID)
  );

  // Update status in Firestore
  // The real-time listener will automatically update Redux when Firestore changes
  const executeStatusUpdate = async (newStatus) => {
    if (!selectedRequest.path) return;

    setUpdatingStatus(newStatus);
    try {
      // Update Firestore
      await dispatch(updateLeaveStatus({
        path: selectedRequest.path,
        status: newStatus
      })).unwrap();

      // Show success message
      showToast("success", `Leave request ${newStatus.toLowerCase()} successfully!`);

      // Note: We DON'T manually update Redux here!
      // The onSnapshot listener will detect the Firestore change
      // and automatically update Redux, which triggers a re-render
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("error", "Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleApprove = () => {
    showConfirm(
      "Are you sure you want to approve this leave request?",
      () => executeStatusUpdate("Approved"),
      "Approve"
    );
  };

  const handleReject = () => {
    showConfirm(
      "Are you sure you want to reject this leave request?",
      () => executeStatusUpdate("Rejected"),
      "Reject"
    );
  };

  // 3. Construct the data object for the UI
  // This computation happens on EVERY render
  // When Redux state changes (via listener), component re-renders
  // and this data is recalculated with the latest values
  const finalData = {
    status: selectedRequest.status || "Pending",
    employeeId: selectedRequest.EmployeeID,
    employee: {
      name: employee?.Name || employee?.name || "Unknown Employee",
      photo: employee?.Photo || employee?.photo || null,
      position: employee?.Position || "Employee",
      department: employee?.Department || "General",
      EmployeeID: employee?.EmployeeID || selectedRequest.EmployeeID,
    },
    leaveDetails: {
      type: selectedRequest.leaveType,
      startDate: formatDate(selectedRequest.startDate),
      endDate: formatDate(selectedRequest.endDate),
      totalDays: selectedRequest.totalDays,
      reason: selectedRequest.reason,
      document: selectedRequest.document || null,
    },
    employeeHistory: {
      leaveBalance: { annual: 12, sick: 5, personal: 2 },
      attendanceSummary: { worked: 140, late: 2, unexcused: 0 },
      requestsThisYear: {
        submitted: employeeRequests.length,
        approved: employeeRequests.filter(req => req.status === "Approved").length,
        rejected: employeeRequests.filter(req => req.status === "Rejected").length
      },
      recentHistory: employeeRequests.map(req => ({
        type: req.leaveType,
        dates: `${formatDate(req.startDate)} - ${formatDate(req.endDate)}`,
        days: req.totalDays,
        status: req.status
      }))
    }
  };

  return (
    <ViewLeaveRequestUI
      data={finalData}
      onApprove={handleApprove}
      onReject={handleReject}
      updatingStatus={updatingStatus}
    />
  );
};

export default ViewLeaveRequestContainer;
