'use client';
import clsx from 'clsx';

import {useState} from "react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <button className="cursor-pointer mr-4" onClick={toggleSidebar}>
        <svg className="h-8 w-8 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2"
             stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="18" x2="20" y2="18"/>
        </svg>
      </button>
      <aside className={clsx("absolute z-10 h-screen w-96 bg-black top-0 left-0", {"hidden": !isSidebarOpen})}>
        <div className="w-full flex items-center p-6">
          <button className="text-white cursor-pointer text-4xl mr-6" onClick={toggleSidebar}>⨯</button>
          <h3 className="text-2xl">Filters</h3>
        </div>
        Filters here!
      </aside>
    </>
  )
}