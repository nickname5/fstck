import Link from 'next/link'
import Sidebar from "@/components/sidebar";

export default function Navigation() {
  return (
    <nav className="w-full flex items-center p-6">
      <Sidebar/>
      <Link href="/" className="mr-4 text-2xl font-medium">Home</Link>
      <Link href="/movies" className="mr-4 text-2xl font-medium">Movies</Link>
    </nav>
  );
}