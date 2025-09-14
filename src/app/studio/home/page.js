"use client";
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import HomePanel from '@/dashboard/HomePanel';
import Sidebar from '@/dashboard/Sidebar';
import Header from '@/dashboard/Header';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
      <HomePanel />
    </>
  );
}