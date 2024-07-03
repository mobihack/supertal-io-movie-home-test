import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import * as z from "zod";

import { Button, Dialog, HelperText, InputLabel } from "@/components";
import { CalendarPicker, FormField } from "@/containers";
import { patchMovieAPI, postMovieAPI } from "@/api/movies";

export const movieFormSchema = z.object({
  title: z.string().min(3, { message: "Minimum 3 characters required" }),
  description: z.string().min(5, { message: "Minimum 5 characters required" }),
  releaseDate: z.string().datetime(),
  duration: z.coerce.number().min(1, { message: "Minimum 1 minute required" }),
  coverImageUrl: z.union([z.literal(""), z.string().trim().url()]),
});

type FormValues = z.infer<typeof movieFormSchema> & { id: string };

const INITIAL_VALUE: z.infer<typeof movieFormSchema> = {
  title: "",
  description: "",
  duration: 120,
  releaseDate: "",
  coverImageUrl: "",
};

interface Props {
  onClose: () => void;
  onSubmit: (values: unknown) => Promise<void>;

  onUpdate: () => void;
  open: false | "create" | "modify";
  initialValue: FormValues | undefined;
}

export const MovieFormDialog = ({
  open,
  onClose,
  onUpdate,
  initialValue,
}: Props): JSX.Element => {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: INITIAL_VALUE,
    resolver: zodResolver(movieFormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  console.log(watch());

  useEffect(() => {
    if (open === "modify") {
      reset(initialValue || INITIAL_VALUE);
    }
  }, [open, reset, initialValue]);

  const onCloseDialog = () => {
    onClose();
    reset(INITIAL_VALUE);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (open === "modify") {
      if (!initialValue || !initialValue.id) return;

      setIsLoading(true);
      toast.promise(patchMovieAPI(initialValue.id, data), {
        loading: "Updating Movie",
        success: () => {
          setIsLoading(false);
          onCloseDialog();
          onUpdate();
          return "Movie updated successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during updation";
        },
      });
    } else {
      setIsLoading(true);
      toast.promise(postMovieAPI(data), {
        loading: "Adding Movie",
        success: () => {
          setIsLoading(false);
          onCloseDialog();
          onUpdate();
          return "Movie added successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during creation";
        },
      });
    }
  };

  return (
    <Dialog.root open={Boolean(open)} onOpenChange={() => onCloseDialog()}>
      <Dialog.content
        aria-describedby={`Dialog to ${
          open === "create" ? "create a new" : "update an existing"
        } movie.`}
        className="max-w-md"
      >
        <Dialog.header>
          <Dialog.title className="text-gray-950 dark:text-gray-50">
            {open === "create" ? "Add Movie" : "Update Movie"}
          </Dialog.title>
        </Dialog.header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  label="Title"
                  placeholder="The Dark Knight Rises"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter a title for you movie"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  component="textarea"
                  label="Description"
                  placeholder="Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace."
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter a description for you movie"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="coverImageUrl"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  value={field.value || ""}
                  label="Cover URL"
                  placeholder="https://example.com/poster.jpeg"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter a cover image url for you movie (Optional)"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="duration"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  type="number"
                  label="Duration"
                  placeholder="120"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter the duration for the movie"
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="releaseDate"
              render={({ field, fieldState }) => (
                <div>
                  <InputLabel htmlFor={"dueAt"}>Release Date</InputLabel>
                  <CalendarPicker
                    id={field.name}
                    {...field}
                    value={field.value || undefined}
                  />

                  <HelperText
                    error={Boolean(fieldState.error)}
                    helperText={
                      (fieldState.error && fieldState.error?.message) ||
                      "Enter a release date for you movie"
                    }
                    className="mt-1"
                  />
                </div>
              )}
            />

            <div className="flex items-center gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                width="full"
                onClick={() => onCloseDialog()}
              >
                Cancel
              </Button>
              <Button type="submit" width="full">
                {open === "create" ? "Add Movie" : "Update Movie"}
                <FiArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </form>
      </Dialog.content>
    </Dialog.root>
  );
};
