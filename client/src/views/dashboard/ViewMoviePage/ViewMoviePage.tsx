import { deleteCommentAPI } from "@/api/comments/deleteCommentAPI";
import { deleteMovieAPI, getMovieAPI } from "@/api/movies";
import { Button, PageHeading } from "@/components";
import { ConfirmDialog } from "@/containers";
import { CommentCard } from "@/containers/CommentCard/CommentCard";
import { CommentForm } from "@/containers/CommentForm/CommentForm";
import { MovieCard } from "@/containers/MovieCard/MovieCard";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { useFetch } from "@/hooks/useFetch";
import clsx from "clsx";
import { format, intervalToDuration } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiEdit, FiImage, FiTrash } from "react-icons/fi";

export const ViewMoviePage = (): JSX.Element => {
  const router = useRouter();
  const auth = useAuth();
  const movieId =
    typeof router?.query?.id === "string" ? `${router.query.id}` : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);

  const {
    data: movie,
    isError,
    isLoading: isMovieLoading,
    mutate,
  } = useFetch(movieId && `/movies/${movieId}`, getMovieAPI);

  const formattedDuration = intervalToDuration({
    start: 0,
    end: (movie?.duration || 0) * 60 * 1000,
  });

  const onDeleteComment = (id: string) => {
    if (!movieId || !id) return;

    setIsLoading(true);
    toast.promise(deleteCommentAPI(id, movieId), {
      loading: "Deleting Comment",
      success: () => {
        setIsLoading(false);
        mutate();
        return "Comment deleted successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during deletion";
      },
    });
  };

  const onDeleteMovie = () => {
    setIsDeleteModelOpen(true);
  };

  const onDeleteMovieConfirmed = () => {
    if (!movie) return;

    toast.promise(deleteMovieAPI(movie.id), {
      loading: "Deleting Movie",
      success: () => {
        setIsLoading(false);
        router.push("/dashboard/main");
        return "Movie deleted successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during deletion";
      },
    });
    setIsDeleteModelOpen(false);
  };

  if (isError) {
    return <div> Movie not found</div>;
  }

  return (
    <div className="w-full mt-16 mb-16">
      {movie && (
        <div>
          <div
            className={clsx(
              "flex md:flex-row flex-col items-center w-full transition-colors",
              "p-4 rounded-xl text-left"
            )}
          >
            <div className="md:w-48 w-1/2  md:mx-0 mx-auto">
              <div className="aspect-[2/3] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="bg-neutral-300/50 dark:bg-neutral-800/50 rounded-xl w-full min-h-full indent-[-9999px] object-contain z-10 absolute"
                  src={movie.coverImageUrl || ""}
                  alt={movie.title}
                />
                <FiImage className="text-3xl opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
                {Boolean(movie.coverImageUrl) && (
                  <div className="absolute bg-gradient-to-b from-black/50 from-10% via-20% via-transparent to-transparent z-30 w-full h-full rounded-xl" />
                )}
              </div>
            </div>
            <div className="flex-1 mt-4 px-8">
              <PageHeading
                title={movie.title}
                subtitle={
                  <>
                    {format(movie.releaseDate, "Y")} &middot;{" "}
                    {`${
                      formattedDuration.hours
                        ? `${formattedDuration.hours}h`
                        : ""
                    } ${
                      formattedDuration.minutes
                        ? `${formattedDuration.minutes}m`
                        : ""
                    }`}
                  </>
                }
                className="!m-0"
              />
              <p className="mt-2 text-sm text-gray-500 ml-1">
                {movie.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  {!movie.isLiked ? (
                    <>
                      <AiOutlineHeart className="mr-1.5 text-red-500" />
                      Like
                    </>
                  ) : (
                    <>
                      <AiFillHeart className="mr-1.5 text-red-500" />
                      Unlike
                    </>
                  )}
                </Button>

                {auth.currentUser?.roles === "ADMIN" && (
                  <Button size="sm" variant="outline" onClick={onDeleteMovie}>
                    <FiTrash className="mr-1.5" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <br />
      <br />

      <div className="md:w-1/2 w-full">
        <p className="text-lg font-medium">Comments</p>
        <hr className="my-4 border-gray-500/20" />
        <div className="mt-8 space-y-10">
          {movie?.comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              text={comment.text}
              name={comment.user.email}
              createdAt={new Date().toISOString()}
              isAdmin={auth.currentUser?.roles === "ADMIN"}
              onDelete={() => onDeleteComment(comment.id)}
            />
          ))}

          {movie?.comments.length === 0 && (
            <div className="text-center text-gray-500">
              This movie {`doesn't`} have any comment. Be the first to add one.
            </div>
          )}

          {movieId && <CommentForm onUpdate={mutate} movieId={movieId} />}
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteModelOpen}
        onConfirm={onDeleteMovieConfirmed}
        onClose={() => setIsDeleteModelOpen(false)}
        title="Delete Movie"
        description="Confirm deletion of movie permanently"
      />
    </div>
  );
};
