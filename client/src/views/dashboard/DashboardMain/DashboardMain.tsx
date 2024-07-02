import { MovieCard } from "@/containers/MovieCard/MovieCard";
import sample_movies from "../../../../../extra/sample_movies.json";
import { PageHeading } from "@/components";

export const DashboardMain = (): JSX.Element => {
  return (
    <div>
      <PageHeading
        title="All Movies"
        subtitle="Current available movies in our platform"
      />
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 justify-center mb-24">
        {sample_movies.map((item) => (
          <MovieCard
            key={item.title}
            title={item.title}
            releaseDate={new Date("January 01, 2023").toISOString()}
            coverUrl={item.thumbnail || null}
            duration={250}
            isLiked={false}
            onClick={() => {}}
            onLikeChange={() => {}}
          />
        ))}
      </div>
    </div>
  );
};