import type { LyricLine } from "@/stores/project";
import { cleanSplitCharacters, getSplitCharacter, stripSplitCharacter } from "@/utils/split-character";

// -- Helpers ------------------------------------------------------------------

function textToLyricLines(text: string, defaultAgentId: string, existingLines: LyricLine[] = []): LyricLine[] {
  const textToCandidates = new Map<string, LyricLine[]>();
  for (const line of existingLines) {
    const key = stripSplitCharacter(line.text);
    let bucket = textToCandidates.get(key);
    if (!bucket) {
      bucket = [];
      textToCandidates.set(key, bucket);
    }
    bucket.push(line);
  }

  const usedExistingIds = new Set<string>();
  const newLines = text.split("\n").filter((line) => line.trim() !== "");

  return newLines.map((lineText, index) => {
    const trimmed = lineText.trim();
    const cleanedText = cleanSplitCharacters(trimmed);
    const matchText = stripSplitCharacter(cleanedText);

    const candidates = textToCandidates.get(matchText);
    const exactMatch = candidates?.find((line) => !usedExistingIds.has(line.id));
    if (exactMatch) {
      usedExistingIds.add(exactMatch.id);
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

    return {
      id: crypto.randomUUID(),
      text: cleanedText,
      agentId: defaultAgentId,
    };
  });
}

// -- Exports ------------------------------------------------------------------

export { textToLyricLines };
