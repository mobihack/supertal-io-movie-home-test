import { request } from "@/lib/axios-request.util";

export const deleteCommentAPI = async (
  id: string,
  movieId: string
): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "DELETE",
    url: `/movies/${movieId}/comment/${id}`,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
