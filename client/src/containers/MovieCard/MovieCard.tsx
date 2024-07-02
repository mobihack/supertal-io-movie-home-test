import clsx from "clsx";
import { format } from "date-fns";
import { intervalToDuration } from "date-fns";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiImage } from "react-icons/fi";

interface Props {
  title: string;
  coverUrl: string | null;

  releaseDate: string;
  duration: number;

  isLiked: boolean;

  onLikeChange: (newValue: boolean) => void;
  onClick: () => void;
}

export const MovieCard = ({
  title,
  releaseDate,
  duration,
  coverUrl,
  isLiked,
  onLikeChange,
  onClick,
}: Props): JSX.Element => {
  const formattedDuration = intervalToDuration({
    start: 0,
    end: duration * 60 * 1000,
  });
  return (
    <div className="relative">
      <button
        role="button"
        onClick={onClick}
        className={clsx(
          "flex flex-col w-full transition-colors",
          "bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl text-left",
          "hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:ring ring-brand-500"
        )}
      >
        <div className="aspect-[2/3] relative">
          <img
            className="bg-neutral-300/50 dark:bg-neutral-800/50 rounded-xl w-full min-h-full indent-[-9999px] object-contain z-10 absolute"
            src={coverUrl || ""}
            alt={title}
          />
          <FiImage className="text-3xl opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
          {Boolean(coverUrl) && (
            <div className="absolute bg-gradient-to-b from-black/50 from-10% via-20% via-transparent to-transparent z-30 w-full h-full" />
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-md mb-1 text-neutral-900 dark:text-neutral-100 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-400">
            {format(releaseDate, "Y")} &middot;{" "}
            {`${formattedDuration.hours ? `${formattedDuration.hours}h` : ""} ${
              formattedDuration.minutes
            }m`}
          </p>
        </div>
      </button>
      <button
        role="button"
        onClick={() => onLikeChange(!isLiked)}
        className="absolute top-6 right-6 z-40 p-2 text-red-500 text-3xl group"
      >
        {isLiked ? (
          <AiFillHeart />
        ) : (
          <AiOutlineHeart className="transition group-hover:scale-125" />
        )}
      </button>
    </div>
  );
};
