import Link from 'next/link'
import Chips from "@/components/chips";
import Image from "next/image";
import placeholder from "./../../../public/file.svg"

export default function MovieCard({movie, className}) {
  return (
    <section className={`${className} group bg-gray-800 rounded-xl w-full p-4 hover:bg-gray-600`}>
      <Link className="flex" href={`/movies/${movie._id}`}>
        <Image className="mr-6 group-hover:brightness-150" src={movie.poster ?? placeholder} alt={movie.title} width={100} height={150}/>
        <div className="grow">
          <div className="flex justify-between">
            <h4 className="text-2xl group-hover:text-rose-200">{movie.title}</h4>
            <span className="text-xl text-sky-500">{movie.imdb.rating ?? "-"}</span>
          </div>
          <span className="block pb-4">{movie.year}</span>
          <p className="pb-4">{movie.plot}</p>
          <Chips items={movie.genres}/>
        </div>

      </Link>
    </section>
  )
}