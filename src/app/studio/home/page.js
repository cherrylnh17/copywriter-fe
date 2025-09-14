"use client";
import React, { useState } from 'react';
import HomePanel from '@/dashboard/HomePanel';
import Sidebar from '@/dashboard/Sidebar';
import Header from '@/dashboard/Header';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          <HomePanel />
        </main>
      </div>
    </>
  );
}
