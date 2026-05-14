import { describe, expect, it } from "vitest";
import { TimelineSyllableSplitter } from "@/views/timeline/timeline-syllable-splitter";
import { render } from "@/test/render";

describe("TimelineSyllableSplitter", () => {
  it("renders nothing initially (no target word selected)", async () => {
    await render(<TimelineSyllableSplitter />);
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("dispatches with composer:timeline:split-syllable event listener without throwing", async () => {
    await render(<TimelineSyllableSplitter />);
    // Event without any selected word, should be a safe no-op.
    window.dispatchEvent(new Event("composer:timeline:split-syllable"));
    expect(document.querySelector("dialog")).toBeNull();
  });
});
