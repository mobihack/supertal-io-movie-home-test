import React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import clsx from "clsx";

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={clsx(
        "text-lg font-bold px-3 py-2",
        "dark:hover:bg-gray-900 dark:data-[state=on]:bg-gray-200 dark:data-[state=on]:text-gray-800",
        "hover:bg-gray-100 data-[state=on]:bg-gray-800 data-[state=on]:text-gray-200",
        "dark:text-gray-200 text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = "ToggleGroup.Item";

const ToggleGroupRoot = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={clsx(
        "inline-flex rounded-lg overflow-hidden",
        "divide-x divide-gray-200 dark:divide-gray-800",
        "border border-gray-200 dark:border-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroupRoot.displayName = "ToggleGroup.Root";

export const ToggleGroup = {
  root: ToggleGroupRoot,
  item: ToggleGroupItem,
};
