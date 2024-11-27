import MovieCard from "@/components/movieCard/movieCard";

async function getMovies() {
  try {
    const response = await fetch('http://localhost:3001/movie?page=1&limit=10');
    return await response.json();
  } catch (e) {
    console.log("Error fetching movies", e);
  }
}

export default async function MovieListPage() {
  const data = await getMovies();

  return (
    <div>
      <h1>Movies</h1>
      {data.movies.map((movie) => <MovieCard className="mb-4" key={movie._id} movie={movie} />)}
    </div>
  );
}