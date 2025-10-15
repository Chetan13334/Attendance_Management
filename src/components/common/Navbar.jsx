import React from 'react'

function Navbar() {
  return (
    <>
    <nav class="bg-white border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      
      <a href="#" class="text-xl font-bold text-gray-800">Navbar</a>

      
      <div class="hidden sm:flex space-x-4 items-center">
        <a href="#" class="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
        <a href="#" class="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Link</a>

        
        <div class="relative group">
          <button class="flex items-center text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
            Dropdown
            <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity">
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Action</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Another action</a>
            <div class="border-t border-gray-200"></div>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Something else here</a>
          </div>
        </div>

        <a href="#" class="text-gray-400 px-3 py-2 rounded-md text-sm font-medium cursor-not-allowed">Disabled</a>

        
        <form class="flex ml-4">
          <input type="search" placeholder="Search" class="px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"/>
          <button type="submit" class="px-3 py-1 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700">Search</button>
        </form>
      </div>
    </div>
  </div>
</nav>

    </>
  )
}

export default Navbar