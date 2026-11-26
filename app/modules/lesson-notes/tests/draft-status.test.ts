import { describe, it, expect } from "vitest";
import { noteDraftStatus } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("noteDraftStatus", () => {
  it("reports the limit the server enforces", () => {
    expect(noteDraftStatus("", null).max).toBe(MAX_NOTE_LENGTH);
  });

  it("cannot save an empty draft when no Note exists", () => {
    expect(noteDraftStatus("", null)).toMatchObject({
      length: 0,
      empty: true,
      dirty: false,
      canSave: false,
    });
  });

  it("treats a whitespace-only draft as empty", () => {
    const status = noteDraftStatus("   \n ", null);
    expect(status.empty).toBe(true);
    expect(status.length).toBe(0);
    expect(status.canSave).toBe(false);
  });

  it("can save a new draft", () => {
    expect(noteDraftStatus("Generics are neat", null)).toMatchObject({
      length: 17,
      empty: false,
      tooLong: false,
      dirty: true,
      canSave: true,
    });
  });

  it("counts characters after trimming, as the server does", () => {
    expect(noteDraftStatus("  abc  ", null).length).toBe(3);
  });

  it("is not dirty when the draft matches the saved Note", () => {
    const status = noteDraftStatus("Saved text", "Saved text");
    expect(status.dirty).toBe(false);
    expect(status.canSave).toBe(false);
  });

  it("ignores surrounding whitespace when comparing to the saved Note", () => {
    expect(noteDraftStatus("Saved text \n", "Saved text").dirty).toBe(false);
  });

  it("ignores surrounding whitespace on the saved Note too", () => {
    expect(noteDraftStatus("Saved text", "  Saved text\n").dirty).toBe(false);
  });

  it("is dirty when the draft changes the saved Note", () => {
    const status = noteDraftStatus("Saved text, edited", "Saved text");
    expect(status.dirty).toBe(true);
    expect(status.canSave).toBe(true);
  });

  it("is dirty but cannot save when the draft clears a saved Note", () => {
    const status = noteDraftStatus("", "Saved text");
    expect(status.dirty).toBe(true);
    expect(status.canSave).toBe(false);
  });

  it("accepts a draft exactly at the limit", () => {
    const status = noteDraftStatus("a".repeat(MAX_NOTE_LENGTH), null);
    expect(status.tooLong).toBe(false);
    expect(status.canSave).toBe(true);
  });

  it("refuses a draft one character over the limit", () => {
    const status = noteDraftStatus("a".repeat(MAX_NOTE_LENGTH + 1), null);
    expect(status.tooLong).toBe(true);
    expect(status.canSave).toBe(false);
  });
});
