/**
 * @vitest-environment node
 */
import type { LyricLine } from "@/stores/project";
import { describe, expect, it } from "vitest";
import { distributeLinesTiming, distributeWordsInLine, formatTime, getLineTiming, nudgeSelectedWords } from "./utils";

// -- distributeWordsInLine -----------------------------------------------------

describe("distributeWordsInLine", () => {
  it("distributes words proportionally by character length", () => {
    // "Hello" = 5 chars, "World" = 5 chars, total = 10 chars
    // Duration = 10 seconds, so each word gets 5 seconds
    const words = distributeWordsInLine("Hello World", 0, 10);

    expect(words).toHaveLength(2);
    expect(words[0]).toEqual({ text: "Hello ", begin: 0, end: 5 });
    expect(words[1]).toEqual({ text: "World", begin: 5, end: 10 });
  });

  it("handles single word", () => {
    const words = distributeWordsInLine("Hello", 0, 5);
    expect(words).toEqual([{ text: "Hello", begin: 0, end: 5 }]);
  });

  it("handles empty string", () => {
    const words = distributeWordsInLine("", 0, 5);
    expect(words).toEqual([]);
  });

  it("handles whitespace-only string", () => {
    const words = distributeWordsInLine("   ", 0, 5);
    expect(words).toEqual([]);
  });

  it("handles multiple spaces between words", () => {
    const words = distributeWordsInLine("Hello    World", 0, 10);
    expect(words).toHaveLength(2);
    expect(words[0].text).toBe("Hello ");
    expect(words[1].text).toBe("World");
  });

  it("handles non-zero begin time", () => {
    const words = distributeWordsInLine("Hi", 5, 7);
    expect(words).toEqual([{ text: "Hi", begin: 5, end: 7 }]);
  });
});

// -- distributeLinesTiming -----------------------------------------------------

describe("distributeLinesTiming", () => {
  it("distributes lines evenly across duration", () => {
    const lines = [
      { id: "1", text: "Line one", agentId: "v1" },
      { id: "2", text: "Line two", agentId: "v1" },
    ];
    const duration = 10;

    const result = distributeLinesTiming(lines, duration);

    expect(result[0].begin).toBe(0);
    expect(result[0].end).toBe(5);
    expect(result[1].begin).toBe(5);
    expect(result[1].end).toBe(10);
  });

  it("includes distributed words for each line", () => {
    const lines = [{ id: "1", text: "Hello World", agentId: "v1" }];
    const duration = 11;

    const result = distributeLinesTiming(lines, duration);

    expect(result[0].words).toHaveLength(2);
    expect(result[0].words[0].text).toBe("Hello ");
    expect(result[0].words[1].text).toBe("World");
  });

  it("handles empty array", () => {
    const result = distributeLinesTiming([], 10);
    expect(result).toEqual([]);
  });

  it("preserves original line properties", () => {
    const lines = [{ id: "abc", text: "Test", agentId: "v2", extra: "data" }];
    const result = distributeLinesTiming(lines, 5);

    expect(result[0].id).toBe("abc");
    expect(result[0].agentId).toBe("v2");
    expect((result[0] as { extra: string }).extra).toBe("data");
  });
});

// -- getLineTiming -------------------------------------------------------------

describe("getLineTiming", () => {
  it("returns timing from words when available", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      words: [
        { text: "Hello", begin: 2, end: 5 },
        { text: "World", begin: 5, end: 8 },
      ],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 2, end: 8 });
  });

  it("returns direct timing when no words", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      begin: 3,
      end: 7,
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 3, end: 7 });
  });

  it("returns null when no timing available", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      begin: undefined,
      end: undefined,
    };

    const timing = getLineTiming(line);

    expect(timing).toBeNull();
  });

  it("prefers words timing over direct timing", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      begin: 0,
      end: 10,
      words: [{ text: "Hello", begin: 2, end: 5 }],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 2, end: 5 });
  });

  it("handles empty words array", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      begin: 3,
      end: 7,
      words: [],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 3, end: 7 });
  });

  it("extends end past main words when bg words end later", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      words: [
        { text: "Hello", begin: 2, end: 5 },
        { text: "World", begin: 5, end: 8 },
      ],
      backgroundText: "echo",
      backgroundWords: [
        { text: "ech", begin: 6, end: 9 },
        { text: "o", begin: 9, end: 12 },
      ],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 2, end: 12 });
  });

  it("pulls begin earlier when bg words begin before main words", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      words: [{ text: "Hello", begin: 5, end: 8 }],
      backgroundText: "ooh",
      backgroundWords: [{ text: "ooh", begin: 3, end: 6 }],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 3, end: 8 });
  });

  it("extends line-synced end when bg words extend past it", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      begin: 3,
      end: 7,
      backgroundText: "ahh",
      backgroundWords: [{ text: "ahh", begin: 6, end: 10 }],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 3, end: 10 });
  });

  it("leaves timing unchanged when bg words sit fully inside main range", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      words: [{ text: "Hello", begin: 2, end: 10 }],
      backgroundText: "yeah",
      backgroundWords: [{ text: "yeah", begin: 4, end: 7 }],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 2, end: 10 });
  });

  it("ignores empty bg words array", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      words: [{ text: "Hello", begin: 2, end: 5 }],
      backgroundWords: [],
    };

    const timing = getLineTiming(line);

    expect(timing).toEqual({ begin: 2, end: 5 });
  });

  it("returns null when bg words exist but no main timing is set", () => {
    const line = {
      id: "1",
      text: "Hello",
      agentId: "v1",
      backgroundText: "ooh",
      backgroundWords: [{ text: "ooh", begin: 3, end: 6 }],
    };

    const timing = getLineTiming(line);

    expect(timing).toBeNull();
  });
});

// -- formatTime ----------------------------------------------------------------

describe("formatTime", () => {
  it("formats zero", () => {
    expect(formatTime(0)).toBe("0:00.00");
  });

  it("formats seconds with centiseconds", () => {
    expect(formatTime(5.25)).toBe("0:05.25");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(65.5)).toBe("1:05.50");
  });

  it("formats multiple minutes", () => {
    expect(formatTime(126)).toBe("2:06.00");
  });

  it("pads seconds correctly", () => {
    expect(formatTime(61)).toBe("1:01.00");
  });

  it("rounds centiseconds down", () => {
    expect(formatTime(1.999)).toBe("0:01.99");
  });
});

// -- nudgeSelectedWords --------------------------------------------------------

function makeLine(id: string, words: { text: string; begin: number; end: number }[]): LyricLine {
  return { id, text: words.map((w) => w.text).join(""), agentId: "v1", words };
}

describe("nudgeSelectedWords", () => {
  it("shifts a single word right preserving duration", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b ", begin: 1, end: 2 },
        { text: "c", begin: 5, end: 6 },
      ]),
    ];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 1 }], 0.05, 10);
    expect(result.appliedDelta).toBeCloseTo(0.05);
    expect(result.updates).toHaveLength(1);
    const updatedWords = result.updates[0].updates.words!;
    expect(updatedWords[1].begin).toBeCloseTo(1.05);
    expect(updatedWords[1].end).toBeCloseTo(2.05);
    expect(updatedWords[0]).toEqual(lines[0].words![0]);
    expect(updatedWords[2]).toEqual(lines[0].words![2]);
  });

  it("shifts a single word left preserving duration", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b", begin: 3, end: 4 },
      ]),
    ];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 1 }], -0.05, 10);
    expect(result.appliedDelta).toBeCloseTo(-0.05);
    expect(result.updates[0].updates.words![1].begin).toBeCloseTo(2.95);
    expect(result.updates[0].updates.words![1].end).toBeCloseTo(3.95);
  });

  it("clamps to neighbor end when partial room left", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b", begin: 1.02, end: 2 },
      ]),
    ];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 1 }], -0.05, 10);
    expect(result.appliedDelta).toBeCloseTo(-0.02);
    expect(result.updates[0].updates.words![1].begin).toBeCloseTo(1);
    expect(result.updates[0].updates.words![1].end).toBeCloseTo(1.98);
  });

  it("is a no-op when already touching previous word", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b", begin: 1, end: 2 },
      ]),
    ];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 1 }], -0.05, 10);
    expect(result.appliedDelta).toBe(0);
    expect(result.updates).toEqual([]);
  });

  it("is a no-op when already touching next word", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b", begin: 1, end: 2 },
      ]),
    ];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 0 }], 0.05, 10);
    expect(result.appliedDelta).toBe(0);
    expect(result.updates).toEqual([]);
  });

  it("clamps to 0 for the first word", () => {
    const lines = [makeLine("L", [{ text: "a", begin: 0.02, end: 1 }])];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 0 }], -0.05, 10);
    expect(result.appliedDelta).toBeCloseTo(-0.02);
    expect(result.updates[0].updates.words![0].begin).toBeCloseTo(0);
    expect(result.updates[0].updates.words![0].end).toBeCloseTo(0.98);
  });

  it("clamps to duration for the last word", () => {
    const lines = [makeLine("L", [{ text: "a", begin: 8, end: 9.98 }])];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 0 }], 0.05, 10);
    expect(result.appliedDelta).toBeCloseTo(0.02);
    expect(result.updates[0].updates.words![0].end).toBeCloseTo(10);
  });

  it("shifts consecutive selected words as a block", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b ", begin: 1, end: 2 },
        { text: "c ", begin: 2, end: 3 },
        { text: "d", begin: 5, end: 6 },
      ]),
    ];
    const result = nudgeSelectedWords(
      lines,
      [
        { lineId: "L", type: "word", wordIndex: 1 },
        { lineId: "L", type: "word", wordIndex: 2 },
      ],
      0.05,
      10,
    );
    expect(result.appliedDelta).toBeCloseTo(0.05);
    const updated = result.updates[0].updates.words!;
    expect(updated[0]).toEqual(lines[0].words![0]);
    expect(updated[1].begin).toBeCloseTo(1.05);
    expect(updated[1].end).toBeCloseTo(2.05);
    expect(updated[2].begin).toBeCloseTo(2.05);
    expect(updated[2].end).toBeCloseTo(3.05);
    expect(updated[3]).toEqual(lines[0].words![3]);
  });

  it("clamps a block to the most-restrictive non-selected neighbor", () => {
    const lines = [
      makeLine("L", [
        { text: "a ", begin: 0, end: 1 },
        { text: "b ", begin: 1, end: 2 },
        { text: "c ", begin: 2, end: 3 },
        { text: "d", begin: 3.02, end: 4 },
      ]),
    ];
    const result = nudgeSelectedWords(
      lines,
      [
        { lineId: "L", type: "word", wordIndex: 1 },
        { lineId: "L", type: "word", wordIndex: 2 },
      ],
      0.05,
      10,
    );
    expect(result.appliedDelta).toBeCloseTo(0.02);
    const updated = result.updates[0].updates.words!;
    expect(updated[2].end).toBeCloseTo(3.02);
  });

  it("nudges background words via backgroundWords", () => {
    const lines: LyricLine[] = [
      {
        id: "L",
        text: "a",
        agentId: "v1",
        words: [{ text: "a", begin: 0, end: 1 }],
        backgroundText: "ooh",
        backgroundWords: [
          { text: "ooh", begin: 2, end: 3 },
          { text: "ah", begin: 5, end: 6 },
        ],
      },
    ];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "bg", wordIndex: 0 }], 0.1, 10);
    expect(result.appliedDelta).toBeCloseTo(0.1);
    expect(result.updates[0].updates.backgroundWords![0].begin).toBeCloseTo(2.1);
    expect(result.updates[0].updates.backgroundWords![0].end).toBeCloseTo(3.1);
    expect(result.updates[0].updates.words).toBeUndefined();
  });

  it("applies the same clamped delta across multiple lines", () => {
    const lines = [
      makeLine("L1", [{ text: "a", begin: 0, end: 1 }]),
      makeLine("L2", [{ text: "b", begin: 5, end: 5.04 }]),
    ];
    const result = nudgeSelectedWords(
      lines,
      [
        { lineId: "L1", type: "word", wordIndex: 0 },
        { lineId: "L2", type: "word", wordIndex: 0 },
      ],
      0.05,
      5.05,
    );
    expect(result.appliedDelta).toBeCloseTo(0.01);
    expect(result.updates).toHaveLength(2);
  });

  it("returns no-op for empty selection", () => {
    const lines = [makeLine("L", [{ text: "a", begin: 0, end: 1 }])];
    const result = nudgeSelectedWords(lines, [], 0.05, 10);
    expect(result.appliedDelta).toBe(0);
    expect(result.updates).toEqual([]);
  });

  it("returns no-op for zero delta", () => {
    const lines = [makeLine("L", [{ text: "a", begin: 0, end: 1 }])];
    const result = nudgeSelectedWords(lines, [{ lineId: "L", type: "word", wordIndex: 0 }], 0, 10);
    expect(result.appliedDelta).toBe(0);
    expect(result.updates).toEqual([]);
  });
});
