"use client";
import React, { useEffect, useState } from "react";
import Sidebar from '@/dashboard/Sidebar';
import Header from '@/dashboard/Header';
import PromptPanel from '@/dashboard/PromptPanel';

export default function StudioPromptWrapper() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
    <>
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
            <PromptPanel />
        </main>
        </div>
    </>
    );

}
