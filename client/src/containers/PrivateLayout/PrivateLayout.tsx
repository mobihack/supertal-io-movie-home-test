import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { ThemeMode, useTheme } from "@/hooks/useTheme";
import { Button, Chip, LoadingIndicator, ToggleGroup } from "@/components";
import {
  FiHeart,
  FiLogOut,
  FiMoon,
  FiSmartphone,
  FiSun,
  FiUser,
  FiVideo,
} from "react-icons/fi";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth/useAuth";
import Link from "next/link";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const appNavigation = [
  { name: "All Movies", href: "/dashboard/main", icon: FiVideo },
  {
    name: "Liked Movies",
    href: "/dashboard/liked",
    icon: FiHeart,
  },
];

const userNavigation = [
  { name: "Sign out", href: "/dashboard/logout", icon: FiLogOut },
];

export const PrivateLayout = ({
  children,
  className,
  ...props
}: Props): JSX.Element => {
  const auth = useAuth();
  const router = useRouter();
  const { theme, switchTheme } = useTheme();

  if (!auth.currentUser) {
    router.push("/auth/login");
    return <LoadingIndicator />;
  }

  return (
    <div
      className={clsx(className, "flex text-gray-950 dark:text-gray-50")}
      {...props}
    >
      <aside className="bg-neutral-50 dark:bg-neutral-950 h-screen w-3/12 max-w-xs p-4 md:flex hidden flex-col sticky top-0">
        <div className="mt-4 mb-12 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brands/logo.png" alt="MovieTracker Logo" />
        </div>
        {[
          {
            title: "Navigation",
            list: appNavigation,
          },
          {
            title: "Profile",
            list: userNavigation,
          },
        ].map((items) => (
          <div key={items.title} className="mb-6">
            <p className="text-gray-500 text-sm">{items.title}</p>
            <div className="mt-4">
              <nav className="space-y-2">
                {items.list.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      router.pathname.startsWith(item.href)
                        ? "bg-brand-500 text-gray-100"
                        : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200",
                      "group rounded-md py-3 px-3 flex items-center text-base font-medium"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        router.pathname.startsWith(item.href)
                          ? "text-gray-100"
                          : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200",
                        "mr-4 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ))}
        <br />
        <div className="mt-auto border-t border-gray-500/20 bg-white dark:bg-black p-4 -mx-4 -mb-4">
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            <span className="">{auth.currentUser.email}</span>

            <Chip size="small">
              {auth.currentUser.roles === "ADMIN" ? "Admin" : "Customer"}
            </Chip>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">Theme</p>
            <ToggleGroup.root
              type="single"
              value={theme || ThemeMode.SYSTEM}
              onValueChange={(value) => {
                switchTheme(value as ThemeMode);
              }}
              aria-label="Text alignment"
            >
              <ToggleGroup.item
                title="Light Mode"
                value={ThemeMode.LIGHT}
                aria-label="Light Mode"
              >
                <FiSun />
              </ToggleGroup.item>
              <ToggleGroup.item
                title="Dark Mode"
                value={ThemeMode.DARK}
                aria-label="Dark Mode"
              >
                <FiMoon />
              </ToggleGroup.item>
              <ToggleGroup.item
                title="System Preference"
                value={ThemeMode.SYSTEM}
                aria-label="System Preference"
              >
                <FiSmartphone />
              </ToggleGroup.item>
            </ToggleGroup.root>
          </div>
        </div>
      </aside>
      <main className="flex flex-1 container">{children}</main>
      <footer className="md:hidden w-screen fixed bottom-0 mb-4 flex justify-center">
        <div className="divide-x divide-brand-400 flex items-center justify-center bg-brand-600 rounded-xl overflow-hidden xs:scale-100 scale-90">
          {[...appNavigation, ...userNavigation].map((link) => (
            <Button
              onClick={() => {
                router.push(link.href);
              }}
              key={link.name}
              variant={
                router.pathname.startsWith(link.href) ? "secondary" : "ghost"
              }
              className="rounded-none"
            >
              <link.icon className="mr-2" />
              {link.name}
            </Button>
          ))}
        </div>
      </footer>
    </div>
  );
};
