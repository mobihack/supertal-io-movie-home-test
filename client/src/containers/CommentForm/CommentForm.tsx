import { Avatar, Button } from "@/components";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { getInitials } from "@/lib/name-to-initials.util";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormField } from "../FormField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { postCommentAPI } from "@/api/comments/postCommentAPI";

export const formSchema = z.object({
  text: z.string().min(5, { message: "Minimum 5 characters required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  movieId: string;
  onUpdate: () => void;
}

export const CommentForm = ({ movieId, onUpdate }: Props) => {
  const auth = useAuth();
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { text: "" },
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    toast.promise(postCommentAPI(movieId, data), {
      loading: "Adding Comment",
      success: () => {
        setIsLoading(false);
        reset();
        onUpdate();
        return "Comment added successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during creation";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex text-sm space-x-4">
        <div className="flex-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Avatar.root>
            <Avatar.fallback>
              {getInitials(auth.currentUser?.email || "Jane Doe")}
            </Avatar.fallback>
          </Avatar.root>
        </div>
        <div className={clsx("flex-1 -mt-4")}>
          <Controller
            control={control}
            name="text"
            render={({ field, fieldState }) => (
              <FormField
                {...field}
                component="textarea"
                label=""
                placeholder=""
                error={Boolean(fieldState.error)}
                helperText={
                  (fieldState.error && fieldState.error?.message) ||
                  "Enter a comment for this movie"
                }
                disabled={isLoading}
                rows={8}
              />
            )}
          />
          <Button disabled={isLoading} type="submit" className="mt-6">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};
