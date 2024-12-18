'use client';

import MovieCard from "@/components/movieCard/movieCard";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";
import {useCallback, useEffect, useState} from "react";

async function getMovies(page = 1, limit = 20) {
  try {
    const response = await fetch(`http://localhost:3001/movie?page=${page}&limit=${limit}`);
    return await response.json();
  } catch (e) {
    console.log("Error fetching movies", e);
    return null;
  }
}

export default function MovieListPage() {
  const [data, setData] = useState({ movies: [], metadata: {page: 1, limit: 20, totalPages:0}});
  const { page, limit, totalPages } = data.metadata;

  const fetchMovies = useCallback((page = 1, limit = 20) => {
    getMovies(page, limit).then((resp) => {
      if (resp) {
        setData(resp);
      }
    });
  }, []);

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
      <Pagination page={page} totalPages={totalPages} limit={limit}/>

    </div>
  );
}