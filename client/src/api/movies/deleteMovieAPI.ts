import { request } from "@/lib/axios-request.util";

export const deleteMovieAPI = async (id: string): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "DELETE",
    url: `/movies/${id}`,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
