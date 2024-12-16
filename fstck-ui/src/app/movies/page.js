import MovieCard from "@/components/movieCard/movieCard";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";
import {cache} from "react";

async function getMovies(page = 1, limit = 10) {
  try {
    const response = await fetch(`http://localhost:3001/movie?page=${page}&limit=${limit}`);
    return await response.json();
  } catch (e) {
    console.log("Error fetching movies", e);
    return null;
  }
}

export default async function MovieListPage() {
  const data = await getMovies();
  const { page, limit, totalPages } = data.metadata;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Movies</h1>
        <Sidebar/>
      </div>
      <Pagination page={page} totalPages={totalPages} limit={limit}/>
      {data.movies.map((movie) => <MovieCard className="mb-4" key={movie._id} movie={movie} />)}
      <Pagination page={page} totalPages={totalPages} limit={limit}/>

    </div>
  );
}