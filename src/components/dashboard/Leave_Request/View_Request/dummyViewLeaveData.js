export const dummyLeaveData = {
  id: "#LR-00125",
  name: "Jane Doe",
  status: "Pending",

  leaveDetails: {
    type: "Sick Leave",
    startDate: "Oct 22, 2024",
    endDate: "Oct 24, 2024",
    totalDays: "3 Days",
    reason:
      "I woke up feeling unwell this morning with a fever and a cough. I have a doctor's appointment scheduled for this afternoon. I will provide a doctor's note upon my return.",
    document: {
      name: "doctors_note_JDoe.pdf",
      size: "128 KB",
    },
  },

  employeeHistory: {
    leaveBalance: {
      annual: "12 / 20 Days",
      sick: "3 / 10 Days",
      personal: "1 / 5 Days",
    },

    attendanceSummary: {
      worked: 198,
      late: 2,
      unexcused: 0,
    },

    requestsThisYear: {
      submitted: 4,
      approved: 3,
      rejected: 0,
    },

    recentHistory: [
      {
        type: "Annual Leave",
        dates: "Aug 15, 2024 - Aug 16, 2024",
        days: 2,
        status: "Approved",
      },
      {
        type: "Sick Leave",
        dates: "May 02, 2024",
        days: 1,
        status: "Approved",
      },
      {
        type: "Personal Leave",
        dates: "Feb 20, 2024",
        days: 1,
        status: "Approved",
      },
    ],
  },
};
