import { LoadingIndicator } from "@/components";
import { useAuth } from "@/hooks/useAuth/useAuth";
import clsx from "clsx";
import { useRouter } from "next/router";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

export const PublicLayout = ({
  children,
  className,
  ...props
}: Props): JSX.Element => {
  const auth = useAuth();
  const router = useRouter();

  if (auth.currentUser) {
    router.push("/dashboard/main");
    return <LoadingIndicator />;
  }

  return (
    <div
      className={clsx(
        className,
        "md:max-w-4xl max-w-lg mx-auto w-full px-4 text-gray-950 dark:text-gray-50"
      )}
      {...props}
    >
      {children}
    </div>
  );
};
