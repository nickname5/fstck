import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="w-full flex">
      <Link href="/" className="mr-4">Home</Link>
      <Link href="/movies" className="mr-4">Movies</Link>
      <Link href="/movies/id-12345">Test movie item</Link>
    </nav>
  );
}