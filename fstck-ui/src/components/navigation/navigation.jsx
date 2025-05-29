import Link from 'next/link'
import AuthButton from "@/components/authButton";

export default function Navigation() {
  return (
    <div className="w-full flex justify-between items-center p-6">
      <nav className="w-full flex items-center">
        <Link href="/" className="mr-4 text-2xl font-medium">Home</Link>
        <Link href="/movies" className="mr-4 text-2xl font-medium">Movies</Link>
        <Link href="/recommendations" className="mr-4 text-2xl font-medium">Recommendations</Link>
      </nav>
      <AuthButton/>
    </div>
  );
}