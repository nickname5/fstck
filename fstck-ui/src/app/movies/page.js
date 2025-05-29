'use client';

import MovieCard from "@/components/movieCard/movieCard";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";
import {useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react";

async function getMovies(token, page = 1, limit = 20, ) {
  if (!token) {
    return null;
  }
  try {
    const response = await fetch(`http://localhost:3003/api/movie?page=${page}&limit=${limit}`, {
      method: "POST",
      body: JSON.stringify({ filters: { minVotes: 20000 } }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (e) {
    console.log("Error fetching movies", e);
    return null;
  }
}

export default function MovieListPage() {
  const [data, setData] = useState({ movies: [], metadata: {page: 1, limit: 20, totalPages:0, filters: {imdb: 7}}});
  const { page, limit, totalPages, filters } = data.metadata;
  const { data: session } = useSession();

  const fetchMovies = useCallback((page = 1, limit = 20) => {
    getMovies(session?.gatewayJwt, page, limit).then((resp) => {
      if (resp) {
        setData(resp);
      }
    });
  }, [session?.gatewayJwt]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Movies</h1>
        <Sidebar/>
      </div>
      <Pagination page={page} totalPages={totalPages} limit={limit} onPageChange={fetchMovies}/>
      {data.movies.map((movie) => <MovieCard className="mb-4" key={movie._id} movie={movie} />)}
      <Pagination page={page} totalPages={totalPages} limit={limit} onPageChange={fetchMovies}/>
    </div>
  );
}