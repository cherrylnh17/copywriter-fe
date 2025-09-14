'use client';
import React from 'react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-700 bg-gray-100 rounded-md shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Users Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Halo, Admin</span>
        <button className="text-sm px-4 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition duration-300">
          Keluar
        </button>
      </div>
    </header>
  );
}
