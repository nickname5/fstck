import Image from 'next/image'
import Chips from "@/components/chips";
import placeholder from "./../../../../public/file.svg"

async function getMovieById(id) {
  try {
    const response = await fetch(`http://localhost:3001/movie/${id}`);
    return await response.json();
  } catch (e) {
    console.log("Error fetching movies", e);
  }
}

export default async function MoviePage({ params }) {
  const id = await params.movieId;
  const movie = await getMovieById(id);

  return (
    <section className="flex">
      <Image src={movie.poster ?? placeholder} alt={movie.title} width={335} height={500}/>
      <section className="flex flex-col px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{movie.title} ({movie.year})</h1>
          <Chips items={movie.genres}/>
        </div>
        <span className="block text-base pb-4">{movie.runtime} min</span>
        <h3 className="text-2xl pb-4">
          IMDB: {movie.imdb?.rating} ({movie.imdb?.votes.toLocaleString()} votes)
        </h3>
        <p className="pb-3">{movie.fullplot}</p>
        <p className="pb-4">{movie.awards.text}</p>


        <Chips items={movie.cast}/>
        <Chips items={movie.countries}/>
      </section>
    </section>
  );
}