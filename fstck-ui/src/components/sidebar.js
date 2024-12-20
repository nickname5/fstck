'use client';
import clsx from 'clsx';

import {useState} from "react";
import MovieFilters from "@/components/movieFilters";

export default function Sidebar({filters, onSubmit}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <aside className={clsx("absolute z-10 h-screen w-1/3 min-w-96 bg-black top-0 left-0", {"hidden": !isSidebarOpen})}>
        <header className="w-full flex items-center p-6 h-20">
          <button className="text-white cursor-pointer text-4xl mr-4 self-end px-2" onClick={toggleSidebar}>⨯</button>
          <h3 className="text-2xl">Filters</h3>
        </header>
        <section className="p-4">
          <MovieFilters filters={{}} onSubmit={() => null} />
        </section>
      </aside>
    </>
  )
}