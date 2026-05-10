import type { LyricLine } from "@/stores/project";
import { cleanSplitCharacters, getSplitCharacter, stripSplitCharacter } from "@/utils/split-character";

// -- Helpers ------------------------------------------------------------------

function textToLyricLines(text: string, defaultAgentId: string, existingLines: LyricLine[] = []): LyricLine[] {
  // Build a map of text -> line data for exact matching
  const textToLine = new Map<string, LyricLine>();
  for (const line of existingLines) {
    const key = stripSplitCharacter(line.text);
    if (!textToLine.has(key)) {
      textToLine.set(key, line);
    }
  }

  const usedExistingIds = new Set<string>();
  const newLines = text.split("\n").filter((line) => line.trim() !== "");

  return newLines.map((lineText, index) => {
    const trimmed = lineText.trim();

    // Clean pipe syntax (strip leading/trailing/consecutive pipes per token)
    const cleanedText = cleanSplitCharacters(trimmed);
    // Strip pipes entirely for matching against existing lines
    const matchText = stripSplitCharacter(cleanedText);

    // Try exact text match first (match against pipe-stripped text or original)
    const exactMatch = textToLine.get(matchText);
    if (exactMatch && !usedExistingIds.has(exactMatch.id)) {
      usedExistingIds.add(exactMatch.id);
      // If text has pipes, update the text and clear timing (structure changed)
      // but preserve group attrs so propagation can fix things up downstream.
      if (cleanedText.includes(getSplitCharacter())) {
        return {
          ...exactMatch,
          text: cleanedText,
          words: undefined,
          begin: undefined,
          end: undefined,
        };
      }
      return { ...exactMatch };
    }

    // Position-based match (for typo fixes) - preserve every field except text/words/timing.
    // KEEP the same id so downstream diffs can route this through updateLineWithHistory
    // and propagate the text change to linked siblings.
    const positionMatch = existingLines[index];
    if (positionMatch && !usedExistingIds.has(positionMatch.id)) {
      usedExistingIds.add(positionMatch.id);
      return {
        ...positionMatch,
        text: cleanedText,
        words: undefined,
        begin: undefined,
        end: undefined,
      };
    }

    // New line - use defaults
    return {
      id: crypto.randomUUID(),
      text: cleanedText,
      agentId: defaultAgentId,
    };
  });
}

// -- Exports ------------------------------------------------------------------

export { textToLyricLines };
