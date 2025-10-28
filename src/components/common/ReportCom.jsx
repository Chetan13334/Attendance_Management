import React, { useState } from "react";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    type: "select",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Your response has been submitted ✅");
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white max-w-md w-full p-10 rounded-lg shadow-2xl">
        {/* Title */}
        <h1 className="text-xl font-bold text-center text-gray-800 mb-6">
          Report a bug or request a feature
        </h1>

        {/* Options */}
        <div className="mt-6 md:flex md:space-x-6 text-sm items-center text-gray-700">
          <p className="w-1/2 mb-2 md:mb-0 font-medium">I would like to</p>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="select">Select an option</option>
            <option value="bug">Report a bug</option>
            <option value="feature">Request a feature</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col text-sm">
            <label htmlFor="title" className="font-bold mb-2 text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col text-sm mt-4">
            <label
              htmlFor="description"
              className="font-bold mb-2 text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter your description"
              className="border border-gray-300 rounded-md p-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 shadow-lg text-white px-4 py-2 hover:bg-blue-700 mt-8 text-center font-semibold rounded-md focus:outline-none transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;