import { useProjectStore } from "@/stores/project";
import { Button } from "@/ui/button";
import { Modal } from "@/ui/modal";
import { Scroll } from "@/ui/scroll";
import { findRepeatingStandaloneSections, type RepeatingSection } from "@/views/timeline/repeating-sections";
import { IconBulb, IconLink, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";

const PREVIEW_MAX = 36;

const GroupingSuggestionsBanner: React.FC = () => {
  const lines = useProjectStore((s) => s.lines);
  const groupRepeatingSections = useProjectStore((s) => s.groupRepeatingSections);
  const [dismissedKeys, setDismissedKeys] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  const suggestions = useMemo(() => findRepeatingStandaloneSections(lines), [lines]);
  const visible = useMemo(
    () => suggestions.filter((s) => !dismissedKeys.has(suggestionKey(s))),
    [suggestions, dismissedKeys],
  );

  if (visible.length === 0) return null;

  const dismissOne = (s: RepeatingSection) => setDismissedKeys((prev) => new Set(prev).add(suggestionKey(s)));

  const dismissAll = () =>
    setDismissedKeys((prev) => {
      const next = new Set(prev);
      for (const s of visible) next.add(suggestionKey(s));
      return next;
    });

  const acceptOne = (s: RepeatingSection) => {
    groupRepeatingSections(s.starts, s.length);
  };

  if (visible.length === 1) {
    const only = visible[0];
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-composer-border bg-composer-accent/8 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <IconBulb className="w-4 h-4 shrink-0 text-composer-accent" />
          <span className="text-composer-text truncate">{summarize(only)}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="sm" variant="primary" hasIcon onClick={() => acceptOne(only)}>
            <IconLink className="w-3.5 h-3.5" />
            Group them
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => dismissOne(only)}
            className="h-7 w-7"
            aria-label="Dismiss suggestion"
          >
            <IconX className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-composer-border bg-composer-accent/8 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <IconBulb className="w-4 h-4 shrink-0 text-composer-accent" />
          <span className="text-composer-text truncate">
            Found {visible.length} grouping suggestions across your lyrics
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="sm" variant="primary" onClick={() => setModalOpen(true)}>
            Review {visible.length}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={dismissAll}
            className="h-7 w-7"
            aria-label="Dismiss all suggestions"
          >
            <IconX className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <SuggestionsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        suggestions={visible}
        onAccept={acceptOne}
        onDismiss={dismissOne}
      />
    </>
  );
};

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: RepeatingSection[];
  onAccept: (s: RepeatingSection) => void;
  onDismiss: (s: RepeatingSection) => void;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose, suggestions, onAccept, onDismiss }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grouping suggestions" className="max-w-xl" bodyClassName="p-0">
      <div className="px-5 py-3 border-b border-composer-border flex items-center gap-2 text-sm text-composer-text-muted">
        <IconBulb className="w-4 h-4 text-composer-accent" />
        <span>
          {suggestions.length} repeating section{suggestions.length === 1 ? "" : "s"} detected. Group them to keep edits
          in sync.
        </span>
      </div>
      <Scroll className="max-h-[60vh]">
        <ul className="divide-y divide-composer-border">
          {suggestions.map((s) => (
            <li key={suggestionKey(s)} className="flex items-start justify-between gap-3 px-5 py-3">
              <div className="min-w-0 flex flex-col gap-0.5">
                <span className="text-sm text-composer-text">{summarize(s)}</span>
                <span className="text-xs text-composer-text-muted">
                  Lines {s.starts.map((start) => `${start + 1} to ${start + s.length}`).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="primary" hasIcon onClick={() => onAccept(s)}>
                  <IconLink className="w-3.5 h-3.5" />
                  Group
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDismiss(s)}
                  className="h-7 w-7"
                  aria-label="Dismiss suggestion"
                >
                  <IconX className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Scroll>
    </Modal>
  );
};

function suggestionKey(s: RepeatingSection): string {
  return `${s.starts.join(",")}:${s.length}`;
}

function summarize(s: RepeatingSection): React.ReactNode {
  const preview = truncate(s.preview.trim() || "(empty line)", PREVIEW_MAX);
  return (
    <>
      {s.starts.length} runs of <span className="text-composer-text-secondary">"{preview}"</span>
      {s.length > 1 ? ` (${s.length} lines each)` : ""}
    </>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}

export { GroupingSuggestionsBanner };
