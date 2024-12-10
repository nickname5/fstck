import Navigation from "@/components/navigation/navigation";

export default function moviesLayout({ children }) {
  return (
    <div className="relative">
      <header className="w-full">
        <Navigation/>
      </header>
      <main className="max-w-screen-xl m-auto mt-6 p-4">
        {children}
      </main>
    </div>
  );
}
