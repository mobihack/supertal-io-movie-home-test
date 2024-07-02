import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { ThemeMode, useTheme } from "@/hooks/useTheme";
import { ToggleGroup } from "@/components";
import {
  FiHeart,
  FiLogOut,
  FiMoon,
  FiSmartphone,
  FiSun,
  FiUser,
  FiVideo,
} from "react-icons/fi";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const appNavigation = [
  { name: "My Movies", href: "#", icon: FiVideo, current: true },
  { name: "Liked Movies", href: "#", icon: FiHeart, current: false },
];

const userNavigation = [
  { name: "Your Profile", href: "#", icon: FiUser, current: false },
  { name: "Sign out", href: "#", icon: FiLogOut, current: false },
];

export const PrivateLayout = ({
  children,
  className,
  ...props
}: Props): JSX.Element => {
  const { theme, switchTheme } = useTheme();
  return (
    <div
      className={clsx(className, "flex text-gray-950 dark:text-gray-50")}
      {...props}
    >
      <aside className="bg-neutral-50 dark:bg-neutral-950 h-screen w-3/12 max-w-xs p-4 md:flex hidden flex-col sticky top-0">
        <div className="mt-4 mb-12 px-4">
          <img src="/assets/brands/logo.png" />
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
                  <a
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      item.current
                        ? "bg-brand-500 text-gray-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      "group rounded-md py-3 px-3 flex items-center text-base font-medium"
                    )}
                  >
                    <item.icon
                      className={clsx(
                        item.current
                          ? "text-gray-100"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-4 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        ))}
        <br />
        <div className="mt-auto flex items-center justify-between">
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
      </aside>
      <main className="flex flex-1 container">{children}</main>
    </div>
  );
};
