export default async function MoviePage({ params }) {
  const id = await params.movieId;
  return (
    <div>Movie page <b>{id}</b></div>
  );
}