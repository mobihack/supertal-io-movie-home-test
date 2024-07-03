import { request } from "@/lib/axios-request.util";
import { ApiResponse } from "@/types/api-response";
interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  coverImageUrl?: string | null | undefined;
  isLiked: boolean;
}

export const getMoviesAPI = async (url: string): Promise<Movie[]> => {
  const { data, error } = await request<ApiResponse<{ movies: Movie[] }>>({
    method: "GET",
    url,
  });

  if (error && !data) {
    console.log(error);

    throw error;
  }

  return data?.data.movies || [];
};
