'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/dashboard/Sidebar';
import Header from '@/dashboard/Header';

export default function StudioLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   if (!token) {
  //     router.push('/sign-in');
  //   }
  // }, []);


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
