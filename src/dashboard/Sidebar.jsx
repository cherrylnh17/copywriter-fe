'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Divider } from '@mui/material';

<Divider />


const menus = [
  { name: 'Dashboard', path: '/studio/home', icon: '🏠' },
  { name: 'History', path: '/studio/history', icon: '📜' },
  { name: 'Prompt', path: '/studio/prompt', icon: '💡' },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // fallback kalau gak ada refreshToken, langsung logout
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("https://malasnulis-api-production-016f.up.railway.app/api/authentications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      console.log("Logout response:", data);

      // hapus token di localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");

      // Redirect
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);

      // tetep apus walaupun error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");
      router.push("/sign-in");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-5 transform z-30 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:min-h-screen`}
      >
        <div className="text-center text-2xl font-bold mb-8">Users Panel</div>
        <nav className="flex flex-col space-y-2">
          {menus.map(({ name, path, icon }) => (
            <button
              key={name}
              onClick={() => {
                router.push(path);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 p-2 rounded-lg transition duration-200 w-full text-left ${
                pathname === path
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'hover:bg-gray-700 hover:text-indigo-400'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </nav>
        <Divider sx={{ my: 2, borderColor: 'grey.400' }} />
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-2 rounded-lg transition duration-200 w-full text-left hover:bg-red-700 hover:text-white bg-red-600/60"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Keluar</span>
        </button>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden flex items-center space-x-3 p-3 rounded-lg transition duration-200 w-full text-left"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
