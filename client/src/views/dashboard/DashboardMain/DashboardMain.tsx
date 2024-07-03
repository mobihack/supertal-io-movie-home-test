import { MovieCard } from "@/containers/MovieCard/MovieCard";
import { Button, PageHeading } from "@/components";
import { useFetch } from "@/hooks/useFetch";
import { getMoviesAPI } from "@/api/movies/getMoviesAPI";
import { MovieFormDialog } from "@/containers/MovieFormDialog";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { postLikeMovieAPI } from "@/api/movies/postLikeMovieAPI";
import { deleteLikeMovieAPI } from "@/api/movies/deleteLikeMovieAPI";
import { ConfirmDialog } from "@/containers";
import { deleteMovieAPI } from "@/api/movies";
import { useAuth } from "@/hooks/useAuth/useAuth";

export const DashboardMain = ({
  type = "all",
}: {
  type?: "all" | "liked";
}): JSX.Element => {
  const auth = useAuth();
  const {
    data: movies,
    isLoading: isMoviesLoading,
    mutate,
  } = useFetch(type === "all" ? "/movies" : "/movies/liked", getMoviesAPI);

  const [dialogMode, setDialogMode] = useState<"create" | "modify" | false>(
    false
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedMovie = undefined;

  const onCloseDialog = () => {
    // close all dialogs
    setIsDeleteModalOpen(false);
    setDialogMode(false);
    // clear selected file
    setSelectedId(null);
  };

  const onLikeChanged = (id: string, value: boolean) => {
    setIsLoading(true);

    if (value) {
      toast.promise(postLikeMovieAPI(id), {
        loading: "Liking Movie",
        success: () => {
          setIsLoading(false);
          mutate();
          return "Movie liked successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during creation";
        },
      });
    } else {
      toast.promise(deleteLikeMovieAPI(id), {
        loading: "Unliking Movie",
        success: () => {
          setIsLoading(false);
          mutate();
          return "Movie unliked successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during creation";
        },
      });
    }
  };

  const onDeleteMovie = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const onDeleteMovieConfirmed = () => {
    if (!selectedId) return;

    toast.promise(deleteMovieAPI(selectedId), {
      loading: "Deleting Movie",
      success: () => {
        setIsLoading(false);
        onCloseDialog();
        mutate();
        return "Movie deleted successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during deletion";
      },
    });
    onCloseDialog();
  };

  return (
    <div className="w-full">
      <PageHeading
        title={type === "all" ? "All Movies" : "Liked Movies"}
        subtitle="Current available movies in our platform"
        actions={
          auth.currentUser?.roles === "ADMIN" ? (
            <Button size="lg" onClick={() => setDialogMode("create")}>
              <FiPlus className="mr-2" /> Add Movie
            </Button>
          ) : (
            <div />
          )
        }
      />

      {movies?.length === 0 && (
        <>{`Couldn't`} find any movies. Please wait for Admin to add one</>
      )}

      <div className="grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 justify-center mb-24">
        {movies?.map((item) => (
          <Link key={item.title} href={`/dashboard/${item.id}`}>
            <MovieCard
              title={item.title}
              releaseDate={new Date(item.releaseDate).toISOString()}
              coverUrl={item.coverImageUrl || null}
              duration={item.duration}
              isLiked={item.isLiked}
              onLikeChange={(v) => onLikeChanged(item.id, v)}
              onDelete={() => onDeleteMovie(item.id)}
              isAdmin={auth.currentUser?.roles === "ADMIN"}
            />
          </Link>
        ))}
      </div>

      <MovieFormDialog
        open={dialogMode}
        onClose={onCloseDialog}
        onSubmit={async () => {}}
        initialValue={selectedMovie}
        onUpdate={() => mutate()}
      />

      <ConfirmDialog
        open={isDeleteModalOpen}
        onConfirm={onDeleteMovieConfirmed}
        onClose={onCloseDialog}
        title="Delete Movie"
        description="Confirm deletion of movie permanently"
      />
    </div>
  );
};
