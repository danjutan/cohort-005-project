import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftStatus = {
  /** Characters that count against the limit: the server trims before saving. */
  length: number;
  max: number;
  empty: boolean;
  tooLong: boolean;
  dirty: boolean;
  canSave: boolean;
};

export function draftStatus(
  draft: string,
  savedBody: string | null
): NoteDraftStatus {
  const trimmed = draft.trim();
  const length = trimmed.length;
  const empty = length === 0;
  const tooLong = length > MAX_NOTE_LENGTH;
  const dirty = trimmed !== (savedBody ?? "").trim();

  return {
    length,
    max: MAX_NOTE_LENGTH,
    empty,
    tooLong,
    dirty,
    canSave: dirty && !empty && !tooLong,
  };
}
