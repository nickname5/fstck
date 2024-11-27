export default function MovieCard({movie, className}) {
  return (
    <section className={`${className} bg-gray-800 rounded-xl w-full`}>
      <h4>{movie.title}</h4>
      <p>{movie.plot}</p>
    </section>
  )
}