import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="w-full flex items-center p-6">
      <Link href="/" className="mr-4 text-2xl font-medium">Home</Link>
      <Link href="/movies" className="mr-4 text-2xl font-medium">Movies</Link>
      <Link href="/recommendations" className="mr-4 text-2xl font-medium">Recommendations</Link>
    </nav>
  );
}