import type { LyricLine, WordTiming } from "@/stores/project";
import { formatTime as formatTimeBase } from "@/utils/format-time";
import { stripSplitCharacter } from "@/utils/split-character";
import { distributeWordsInLine, getLineTiming } from "@/utils/sync-helpers";

// -- Functions -----------------------------------------------------------------

function distributeLinesTiming<T extends { id: string; text: string }>(
  lines: T[],
  duration: number,
): (T & { begin: number; end: number; words: WordTiming[] })[] {
  if (lines.length === 0) return [];

  const lineDuration = duration / lines.length;

  return lines.map((line, index) => {
    const begin = index * lineDuration;
    const end = (index + 1) * lineDuration;
    return {
      ...line,
      begin,
      end,
      words: distributeWordsInLine(line.text, begin, end),
    };
  });
}

const formatTime = (seconds: number) => formatTimeBase(seconds, 2);

interface WordAtTimeResult {
  lineId: string;
  lineIndex: number;
  wordIndex: number;
  type: "word" | "bg";
}

function findWordAtTime(lines: LyricLine[], time: number): WordAtTimeResult | null {
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    if (line.words) {
      for (let wordIndex = 0; wordIndex < line.words.length; wordIndex++) {
        const word = line.words[wordIndex];
        if (time >= word.begin && time < word.end) {
          return { lineId: line.id, lineIndex, wordIndex, type: "word" };
        }
      }
    }

    if (line.backgroundWords) {
      for (let wordIndex = 0; wordIndex < line.backgroundWords.length; wordIndex++) {
        const word = line.backgroundWords[wordIndex];
        if (time >= word.begin && time < word.end) {
          return { lineId: line.id, lineIndex, wordIndex, type: "bg" };
        }
      }
    }
  }

  return null;
}

function isLineSynced(line: LyricLine): boolean {
  return !line.words?.length && line.begin !== undefined && line.end !== undefined;
}

function getEffectiveLines(lines: LyricLine[]): LyricLine[] {
  return lines.map((line) => {
    if (!isLineSynced(line)) return line;
    return {
      ...line,
      words: [{ text: stripSplitCharacter(line.text), begin: line.begin!, end: line.end! }],
    };
  });
}

interface NudgeSelection {
  lineId: string;
  type: "word" | "bg";
  wordIndex: number;
}

interface NudgeUpdate {
  id: string;
  updates: Partial<LyricLine>;
}

interface NudgeResult {
  appliedDelta: number;
  updates: NudgeUpdate[];
}

function nudgeSelectedWords(
  lines: LyricLine[],
  selections: NudgeSelection[],
  requestedDelta: number,
  duration: number,
): NudgeResult {
  if (selections.length === 0 || requestedDelta === 0) {
    return { appliedDelta: 0, updates: [] };
  }

  type Group = { line: LyricLine; type: "word" | "bg"; indices: Set<number> };
  const groups = new Map<string, Group>();
  for (const sel of selections) {
    const line = lines.find((l) => l.id === sel.lineId);
    if (!line) continue;
    const wordsArray = sel.type === "word" ? line.words : line.backgroundWords;
    if (!wordsArray || wordsArray[sel.wordIndex] === undefined) continue;
    const key = `${sel.lineId}:${sel.type}`;
    let group = groups.get(key);
    if (!group) {
      group = { line, type: sel.type, indices: new Set() };
      groups.set(key, group);
    }
    group.indices.add(sel.wordIndex);
  }

  if (groups.size === 0) return { appliedDelta: 0, updates: [] };

  const direction = requestedDelta < 0 ? -1 : 1;
  let allowedMagnitude = Math.abs(requestedDelta);

  for (const group of groups.values()) {
    const wordsArray = (group.type === "word" ? group.line.words : group.line.backgroundWords) as WordTiming[];
    for (const idx of group.indices) {
      const word = wordsArray[idx];
      let headroom: number;
      if (direction < 0) {
        let prevEnd = 0;
        for (let i = idx - 1; i >= 0; i--) {
          if (!group.indices.has(i)) {
            prevEnd = wordsArray[i].end;
            break;
          }
        }
        headroom = word.begin - prevEnd;
      } else {
        let nextBegin = duration;
        for (let i = idx + 1; i < wordsArray.length; i++) {
          if (!group.indices.has(i)) {
            nextBegin = wordsArray[i].begin;
            break;
          }
        }
        headroom = nextBegin - word.end;
      }
      if (headroom < allowedMagnitude) allowedMagnitude = headroom;
      if (allowedMagnitude <= 0) return { appliedDelta: 0, updates: [] };
    }
  }

  const appliedDelta = direction * allowedMagnitude;
  const updates: NudgeUpdate[] = [];
  for (const group of groups.values()) {
    const wordsArray = (group.type === "word" ? group.line.words : group.line.backgroundWords) as WordTiming[];
    const updatedWords = wordsArray.map((w, i) =>
      group.indices.has(i) ? { ...w, begin: w.begin + appliedDelta, end: w.end + appliedDelta } : w,
    );
    updates.push({
      id: group.line.id,
      updates: group.type === "word" ? { words: updatedWords } : { backgroundWords: updatedWords },
    });
  }

  return { appliedDelta, updates };
}

// -- Exports -------------------------------------------------------------------

export {
  distributeWordsInLine,
  distributeLinesTiming,
  getLineTiming,
  formatTime,
  findWordAtTime,
  isLineSynced,
  getEffectiveLines,
  nudgeSelectedWords,
};
export type { NudgeSelection, NudgeUpdate, NudgeResult };
