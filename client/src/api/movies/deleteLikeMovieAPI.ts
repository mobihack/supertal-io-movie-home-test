import { request } from "@/lib/axios-request.util";

export const deleteLikeMovieAPI = async (id: string): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "DELETE",
    url: `/movies/${id}/like`,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
