import { draftStatus, type NoteDraftStatus } from "./lib/draft";

export type { NoteDraftStatus };

/**
 * What the Lesson page's note editor shows about the Student's draft: the
 * character count against the limit, whether it has unsaved changes, and
 * whether Save should be enabled. `savedBody` is the Note as last saved, or
 * null when the Student has not written one.
 */
export function noteDraftStatus(
  draft: string,
  savedBody: string | null
): NoteDraftStatus {
  return draftStatus(draft, savedBody);
}
