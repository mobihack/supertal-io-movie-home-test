import * as React from "react";
import clsx from "clsx";

interface PageHeadingProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const PageHeading = ({
  title,
  subtitle,
  className,
}: PageHeadingProps): JSX.Element => {
  return (
    <div className={clsx("mt-24 mb-16", className)}>
      <h1 className="text-5xl mb-4 font-weight-medium dark:text-gray-200">
        {title}
      </h1>
      <h3 className="ml-1 text-base text-gray-500 dark:text-gray-500 tracking-wider">
        {subtitle}
      </h3>
    </div>
  );
};
