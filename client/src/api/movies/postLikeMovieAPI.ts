import { request } from "@/lib/axios-request.util";

export const postLikeMovieAPI = async (id: string): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "POST",
    url: `/movies/${id}/like`,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
