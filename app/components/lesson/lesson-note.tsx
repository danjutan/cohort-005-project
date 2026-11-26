import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import { Lock, NotebookPen } from "lucide-react";
import { toast } from "sonner";
import type { Route } from "../../routes/+types/courses.$slug.lessons.$lessonId";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { noteDraftStatus } from "~/modules/lesson-notes";

type SavedNote = Extract<
  Route.ComponentProps["loaderData"],
  { view: "full" }
>["note"];

// Laid out like the Questions & Discussion card further down the page, so the
// two read as one family: same heading, same form footer.
export function LessonNote({ note }: { note: SavedNote }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [draft, setDraft] = useState(note?.body ?? "");
  const status = noteDraftStatus(draft, note?.body ?? null);
  const isSaving = fetcher.state !== "idle";
  const error = isSaving ? undefined : fetcher.data?.error;

  // A toast, as the discussion form does: an inline error outlived the draft
  // that caused it.
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <NoteHeading />

        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            rows={5}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Jot down what you want to remember from this lesson..."
            aria-label="Your notes"
            className="min-h-28 resize-y"
          />

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !status.canSave}
            >
              {isSaving ? "Saving..." : "Save note"}
            </Button>

            <NoteState dirty={status.dirty} updatedAt={note?.updatedAt} />

            <span
              className={cn(
                "ml-auto text-xs",
                status.tooLong ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {status.length} / {status.max}
            </span>
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteHeading() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <NotebookPen className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Your notes</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        <Lock className="mr-1.5 inline size-3.5 align-[-2px]" />
        Only you can read these. Find all your notes under{" "}
        <Link to="/saved" className="underline hover:text-foreground">
          Saved
        </Link>
        .
      </p>
    </div>
  );
}

function NoteState({
  dirty,
  updatedAt,
}: {
  dirty: boolean;
  updatedAt: string | undefined;
}) {
  if (dirty && updatedAt) {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (!updatedAt) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved · last edited {formatRelativeTime(updatedAt)}
    </span>
  );
}
