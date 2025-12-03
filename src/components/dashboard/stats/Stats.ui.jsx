import React from "react";
import { UserCheck, UserX, Clock, Calendar } from "lucide-react";
import { SkeletonLoader } from "../../common/skeleton/Skeleton";

const StatCardUI = ({ title, value, icon: Icon, color, onClick }) => {
  // Create classes dynamically instead of using template literals with variables
  const getShadowColorClass = (color) => {
    switch (color) {
      case "green": return "shadow-green-100";
      case "red": return "shadow-red-100";
      case "blue": return "shadow-blue-100";
      case "yellow": return "shadow-yellow-100";
      default: return "shadow-gray-100";
    }
  };

  const getGradientBgClass = (color) => {
    switch (color) {
      case "green": return "from-green-200 to-green-100";
      case "red": return "from-red-200 to-red-100";
      case "blue": return "from-blue-200 to-blue-100";
      case "yellow": return "from-yellow-100 to-yellow-50";
      default: return "from-gray-400 to-gray-600";
    }
  };

  return (
    <button
      className={`w-full text-left p-6 bg-white rounded-2xl shadow-lg transition-all duration-200 
        hover:shadow-xl hover:-translate-y-1 
        active:scale-95 active:shadow-md
        focus:outline-none
        flex items-center justify-between border border-gray-100 hover:border-${color}-200 
        ${getShadowColorClass(color)}`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {value === "..." ? "..." : value}
        </p>
      </div>
      <div
        className={`p-3 rounded-xl bg-gradient-to-br ${getGradientBgClass(color)} text-white shadow-md`}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </button>
  );
};

// Skeleton version of StatCardUI
const StatCardSkeleton = () => (
  <SkeletonLoader type="stat" />
);

const StatsUI = ({ currentStats }) => {
  // Check if we're in loading state (values are "...")
  const isLoading = currentStats.some(stat => stat.value === "...");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className=" pl-5 pr-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative top-4">
      {currentStats.map((stat, index) => (
        <StatCardUI key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsUI;