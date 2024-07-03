import * as React from "react";
import clsx from "clsx";

interface PageHeadingProps {
  title: string;
  subtitle: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const PageHeading = ({
  title,
  subtitle,
  className,
  actions,
}: PageHeadingProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "mt-24 mb-16",
        "flex md:flex-row flex-col items-center justify-between gap-4 md:text-left text-center",
        className
      )}
    >
      <div>
        <h1 className="md:text-5xl text-3xl mb-4 font-weight-medium dark:text-gray-200">
          {title}
        </h1>
        <h3 className="ml-1 md:text-base text-sm text-gray-500 dark:text-gray-500 tracking-wider">
          {subtitle}
        </h3>
      </div>
      <div>{actions}</div>
    </div>
  );
};
