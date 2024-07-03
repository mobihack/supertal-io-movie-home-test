import { request } from "@/lib/axios-request.util";
import { ApiResponse } from "@/types/api-response";
interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  coverImageUrl?: string | null | undefined;
  comments: {
    id: string;
    text: string;
    user: {
      email: string;
    };
  }[];
  isLiked: boolean;
}

export const getMovieAPI = async (url: string): Promise<Movie | null> => {
  const { data, error } = await request<ApiResponse<Movie>>({
    method: "GET",
    url,
  });

  if (error && !data) {
    console.log(error);

    throw error;
  }

  return data?.data || null;
};
