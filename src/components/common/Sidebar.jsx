import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import imgLogout from "../assets/logout.png";

const Sidebar = ({ isOpen, setIsOpen, handleSignOut, isProfileOpen }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const getLinkClass = ({ isActive }) => {
    return `flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden ${isActive ? "bg-blue-100 font-semibold" : ""
      }`;
  };


  const isProfileActive = isProfileOpen;

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        id="hs-sidebar-footer"
        className={`lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 transition-all duration-300 transform h-full fixed top-0 start-0 bottom-0 z-50 bg-white border-e border-gray-200 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          <header className="mt-auto p-4 flex justify-between items-center gap-x-5">
            <a
              className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80"
              href="#"
              aria-label="Brand"
            >
              Attendify
            </a>

            <div className="lg:hidden -me-2">
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div
              className="hs-accordion-group pb-0 px-2 w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open
            >
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={getLinkClass}
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/employee_details"
                    className={getLinkClass}
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Employee
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/calendar"
                    className={({ isActive }) =>
                      `w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden ${isActive ? "bg-blue-100 font-semibold" : ""
                      }`
                    }
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    Calendar
                    <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full">
                      New
                    </span>
                  </NavLink>
                </li>

                <li className="mt-3 px-2">
                  <NavLink
                    to="/add-employee"
                    className={({ isActive }) =>
                      `w-full flex items-center justify-center gap-x-2 py-2 px-3 text-sm font-medium text-white rounded-lg shadow hover:bg-blue-800 focus:outline-none transition ${isActive ? "bg-blue-700" : "bg-blue-600"
                      }`
                    }
                  >
                    + Add Employee
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>


        </div>
      </div>
    </>
  );
};

export default Sidebar;