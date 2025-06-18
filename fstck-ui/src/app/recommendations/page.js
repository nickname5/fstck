import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import Sidebar from "@/components/sidebar";
import MovieCard from "@/components/movieCard/movieCard";

async function getRecommendations() {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.gatewayJwt;
    const response = await fetch(
      `${process.env.GATEWAY_SERVICE_URL}/api/recommendation`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return await response.json();
  } catch (e) {
    console.log("Error fetching recommendations", e);
  }
}

export default async function RecommendationPage() {
  const movies = await getRecommendations();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Recommendations</h1>
        <Sidebar/>
      </div>
      {movies.map((movie) => <MovieCard className="mb-4" key={movie._id} movie={movie}/>)}
    </div>
  );
}