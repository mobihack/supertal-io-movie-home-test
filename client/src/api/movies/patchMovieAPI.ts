import { request } from "@/lib/axios-request.util";

interface Body {
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  coverImageUrl: string | null | undefined;
}

export const patchMovieAPI = async (
  id: string,
  body: Partial<Body>
): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "PATCH",
    url: `/movies/${id}`,
    data: body,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
