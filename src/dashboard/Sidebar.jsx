"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, History, Lightbulb } from "lucide-react";

const menus = [
  { name: "Dashboard", path: "/studio/home", icon: <LayoutDashboard size={18} /> },
  { name: "History", path: "/studio/history", icon: <History size={18} /> },
  { name: "Prompt", path: "/studio/prompt", icon: <Lightbulb size={18} /> },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/sign-in");
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-neutral-950 border-r border-neutral-800 p-5 z-30 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative`}
      >
        {/* Title */}
        <div className="text-center text-xl font-bold text-white mb-8">
          Users Panel
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {menus.map(({ name, path, icon }) => (
            <button
              key={name}
              onClick={() => {
                router.push(path);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  pathname === path
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-neutral-800 hover:text-indigo-400"
                }`}
            >
              {icon}
              <span>{name}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 w-full px-5">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition bg-red-600/80 text-white hover:bg-red-700"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Overlay  mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
