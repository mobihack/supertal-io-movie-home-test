import { Avatar, Button } from "@/components";
import { TIME_FORMAT } from "@/constants/time-format.constants";
import { getInitials } from "@/lib/name-to-initials.util";
import clsx from "clsx";
import { formatDate } from "date-fns";
import { FiTrash2 } from "react-icons/fi";

interface Props {
  text: string;
  createdAt: string;
  name: string;
  isAdmin?: boolean;
  onDelete: () => void;
}

export const CommentCard = ({
  text,
  createdAt,
  name,
  onDelete,
  isAdmin = true,
}: Props): JSX.Element => {
  return (
    <div className="flex text-sm space-x-4">
      <div className="flex-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Avatar.root>
          <Avatar.fallback>{getInitials(name)}</Avatar.fallback>
        </Avatar.root>
      </div>
      <div
        className={clsx(
          // reviewIdx === 0 ? "" : "border-t border-gray-200",
          "flex-1"
        )}
      >
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-0.5">
          {name}
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          <time dateTime={formatDate(createdAt, TIME_FORMAT.US_DATE)}>
            {formatDate(createdAt, TIME_FORMAT.US_SHORT)}
          </time>
        </p>

        <div className="mt-4 prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          {text}
        </div>
        {isAdmin && (
          <div className="mt-2 flex items-center gap-2">
            <Button variant="ghost" size="iconSmall" onClick={onDelete}>
              <FiTrash2 className="text-xs text-red-800" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
//
