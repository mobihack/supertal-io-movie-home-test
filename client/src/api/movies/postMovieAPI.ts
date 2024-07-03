import { request } from "@/lib/axios-request.util";

interface Body {
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  coverImageUrl?: string | null | undefined;
}
export const postMovieAPI = async (body: Body): Promise<unknown> => {
  const { data, error } = await request<unknown>({
    method: "POST",
    url: `/movies`,
    data: body,
  });

  if (error && !data) {
    throw error;
  }

  return data;
};
