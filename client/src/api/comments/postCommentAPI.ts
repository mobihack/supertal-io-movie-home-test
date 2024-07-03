import { request } from "@/lib/axios-request.util";

interface Body {
  text: string;
}
export const postCommentAPI = async (
  movieId: string,
  body: Body
): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "POST",
    url: `/movies/${movieId}/comment`,
    data: body,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
