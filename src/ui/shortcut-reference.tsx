import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { isMac } from "@/utils/platform";
import { IconCommand } from "@tabler/icons-react";
import { t } from "i18next";

// -- Types --------------------------------------------------------------------

interface ShortcutItemProps {
  keys: string[];
  description: string;
  shortcutId?: string;
}

interface ShortcutSectionProps {
  title: string;
  shortcuts: ShortcutItemProps[];
}

// -- Helpers ------------------------------------------------------------------

function formatKey(key: string): string {
  if (key === "Mod") return isMac ? "⌘" : "Ctrl";
  if (key === "Meta") return isMac ? "⌘" : "Meta";
  if (key === "Ctrl") return isMac ? "⌃" : "Ctrl";
  if (key === "Shift") return "⇧";
  if (key === "Alt") return isMac ? "⌥" : "Alt";
  if (key === "Space") return "Space";
  if (key === "Enter") return "↵";
  if (key === "ArrowLeft") return "←";
  if (key === "ArrowRight") return "→";
  if (key === "ArrowUp") return "↑";
  if (key === "ArrowDown") return "↓";
  return key;
}

// -- Data ---------------------------------------------------------------------

const getShortcutSections = (): ShortcutSectionProps[] => [
  {
    title: t("General"),
    shortcuts: [
      {
        keys: ["Shift", "?"],
        description: t("Show keyboard shortcuts"),
        shortcutId: "global.help",
      },
      {
        keys: ["Enter"],
        description: t("Play / Pause audio"),
        shortcutId: "global.playPause",
      },
      {
        keys: ["Mod", "Shift", "Alt", "E"],
        description: t("Download saved work"),
        shortcutId: "global.panicRecovery",
      },
    ],
  },
  {
    title: t("Navigation"),
    shortcuts: [
      { keys: ["Mod", "1"], description: t("Go to Import tab") },
      { keys: ["Mod", "2"], description: t("Go to Edit tab") },
      { keys: ["Mod", "3"], description: t("Go to Sync tab") },
      { keys: ["Mod", "4"], description: t("Go to Timeline tab") },
      { keys: ["Mod", "5"], description: t("Go to Preview tab") },
      { keys: ["Mod", "6"], description: t("Go to Export tab") },
    ],
  },
  {
    title: t("Sync Mode"),
    shortcuts: [
      {
        keys: ["Space"],
        description: t("Start sync / Tap to sync word"),
        shortcutId: "sync.tap",
      },
      {
        keys: ["F"],
        description: t("Hold to sync word (hold mode)"),
        shortcutId: "sync.holdSync",
      },
      {
        keys: ["ArrowLeft"],
        description: t("Nudge last synced -50ms"),
        shortcutId: "sync.nudgeLeft",
      },
      {
        keys: ["ArrowRight"],
        description: t("Nudge last synced +50ms"),
        shortcutId: "sync.nudgeRight",
      },
      { keys: ["Mod", "Z"], description: t("Undo") },
      { keys: ["Mod", "Shift", "Z"], description: t("Redo") },
    ],
  },
  {
    title: t("Timeline Mode"),
    shortcuts: [
      {
        keys: ["F"],
        description: t("Toggle follow playhead"),
        shortcutId: "timeline.toggleFollow",
      },
      {
        keys: ["P"],
        description: t("Toggle preview sidebar"),
        shortcutId: "timeline.togglePreview",
      },
      {
        keys: ["R"],
        description: t("Toggle rolling edit"),
        shortcutId: "timeline.toggleRollingEdit",
      },
      {
        keys: ["T"],
        description: t("Toggle snap (magnet)"),
        shortcutId: "timeline.toggleSnap",
      },
      {
        keys: ["N"],
        description: t("Insert line below selected word"),
        shortcutId: "timeline.insertLineBelow",
      },
      {
        keys: ["Shift", "N"],
        description: t("Insert line above selected word"),
        shortcutId: "timeline.insertLineAbove",
      },
      {
        keys: ["X"],
        description: t("Expand all lines"),
        shortcutId: "timeline.expandAll",
      },
      {
        keys: ["Space"],
        description: t("Jump viewport to playhead"),
        shortcutId: "timeline.jumpToPlayhead",
      },
      { keys: ["Escape"], description: t("Deselect / cancel paste") },
      {
        keys: ["["],
        description: t("Set word begin to playhead"),
        shortcutId: "timeline.setWordBegin",
      },
      {
        keys: ["]"],
        description: t("Set word end to playhead"),
        shortcutId: "timeline.setWordEnd",
      },
      { keys: ["Mod", "Z"], description: t("Undo") },
      { keys: ["Mod", "Shift", "Z"], description: t("Redo") },
      {
        keys: ["Mod", "Shift", "V"],
        description: t("Import lyrics"),
        shortcutId: "timeline.importLyrics",
      },
      { keys: ["Mod", "Scroll"], description: t("Zoom in / out") },
      { keys: ["Middle", "Drag"], description: t("Pan timeline") },
      {
        keys: ["Shift", "Middle", "Drag"],
        description: t("Pan locked to axis"),
      },
    ],
  },
  {
    title: t("Timeline Selection"),
    shortcuts: [
      { keys: ["Click"], description: t("Select word") },
      {
        keys: ["Shift", "Click"],
        description: t("Select all syllables in word"),
      },
      { keys: ["Mod", "A"], description: t("Select all words") },
      {
        keys: ["A"],
        description: t("Select word under playhead"),
        shortcutId: "timeline.selectWordAtPlayhead",
      },
      { keys: ["Mod", "Click"], description: t("Toggle word in selection") },
      { keys: ["Drag"], description: t("Marquee select words") },
      {
        keys: ["Shift", "Drag"],
        description: t("Add to selection with marquee"),
      },
      { keys: ["Mod", "C"], description: t("Copy selected words") },
      { keys: ["Mod", "X"], description: t("Cut selected words") },
      {
        keys: ["Mod", "V"],
        description: t("Paste (ghost preview, click to place)"),
      },
      { keys: ["Delete"], description: t("Delete selected words") },
      { keys: ["Alt", "Drag"], description: t("Duplicate selected words") },
      {
        keys: ["E"],
        description: t("Edit selected word text"),
        shortcutId: "timeline.editWord",
      },
      { keys: ["F2"], description: t("Edit selected word text") },
      {
        keys: ["S"],
        description: t("Split selected word into syllables"),
        shortcutId: "timeline.splitSyllable",
      },
      {
        keys: ["Shift", "S"],
        description: t("Split word into words"),
        shortcutId: "timeline.splitWord",
      },
      {
        keys: ["M"],
        description: t("Merge adjacent selected words"),
        shortcutId: "timeline.mergeWords",
      },
      {
        keys: ["Y"],
        description: t("Merge syllables into one word"),
        shortcutId: "timeline.mergeSyllablesIntoWord",
      },
      {
        keys: ["W"],
        description: t("Split line into words"),
        shortcutId: "timeline.splitIntoWords",
      },
      {
        keys: ["Shift", "E"],
        description: t("Mark / unmark explicit"),
        shortcutId: "timeline.toggleExplicit",
      },
      {
        keys: ["ArrowLeft"],
        description: t("Nudge selected words left"),
        shortcutId: "timeline.nudgeLeft",
      },
      {
        keys: ["ArrowRight"],
        description: t("Nudge selected words right"),
        shortcutId: "timeline.nudgeRight",
      },
      { keys: ["Double Click"], description: t("Edit word / create word") },
    ],
  },
  {
    title: t("Linked Groups"),
    shortcuts: [
      {
        keys: ["Mod", "G"],
        description: t("Group selected lines"),
        shortcutId: "timeline.createGroup",
      },
      {
        keys: ["Mod", "D"],
        description: t("Duplicate as linked instance"),
        shortcutId: "timeline.duplicateAsLinked",
      },
      {
        keys: ["C"],
        description: t("Collapse / expand current instance"),
        shortcutId: "timeline.toggleCollapseInstance",
      },
      {
        keys: ["Shift", "C"],
        description: t("Collapse / expand all"),
        shortcutId: "timeline.toggleAllCollapsed",
      },
      {
        keys: ["Mod", "J"],
        description: t("Jump to previous instance"),
        shortcutId: "timeline.jumpPrevInstance",
      },
      {
        keys: ["Mod", "K"],
        description: t("Jump to next instance"),
        shortcutId: "timeline.jumpNextInstance",
      },
      {
        keys: ["H"],
        description: t("Ping sibling instances"),
        shortcutId: "timeline.pingSiblings",
      },
      {
        keys: ["Shift", "P"],
        description: t("Shift current instance to playhead"),
        shortcutId: "timeline.shiftInstanceToPlayhead",
      },
      {
        keys: ["Shift", "J"],
        description: t("Jump to start of current instance"),
        shortcutId: "timeline.jumpToInstanceStart",
      },
      {
        keys: ["ArrowLeft"],
        description: t("Nudge selected words / instance earlier"),
      },
      {
        keys: ["ArrowRight"],
        description: t("Nudge selected words / instance later"),
      },
      {
        keys: ["Mod", "Shift", "D"],
        description: t("Detach current instance"),
        shortcutId: "timeline.detachInstance",
      },
      {
        keys: ["Mod", "Shift", "G"],
        description: t("Delete current group"),
        shortcutId: "timeline.deleteGroup",
      },
    ],
  },
  {
    title: t("Edit Mode"),
    shortcuts: [
      { keys: ["Click"], description: t("Select / deselect line") },
      { keys: ["Shift", "Click"], description: t("Select range of lines") },
      {
        keys: ["Drag"],
        description: t("Drag on line numbers to select a range"),
      },
    ],
  },
];

// -- Components ---------------------------------------------------------------

const KeyBadge: React.FC<{ keyName: string }> = ({ keyName }) => {
  const formatted = formatKey(keyName);
  const isSymbol = formatted.length === 1 && !/[a-zA-Z0-9]/.test(formatted);

  return (
    <span
      className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-medium rounded bg-composer-button border border-composer-border ${
        isSymbol ? "text-base" : ""
      }`}
    >
      {(keyName === "Mod" || keyName === "Meta") && isMac ? (
        <IconCommand className="size-3.5" />
      ) : (
        formatted
      )}
    </span>
  );
};

const ShortcutItem: React.FC<ShortcutItemProps> = ({
  keys,
  description,
  shortcutId,
}) => {
  const resolvedKeys = shortcutId ? getEffectiveKeysArray(shortcutId) : keys;
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-composer-text-secondary">
        {description}
      </span>
      <div className="flex items-center gap-1">
        {resolvedKeys.map((key) => (
          <KeyBadge key={key} keyName={key} />
        ))}
      </div>
    </div>
  );
};

const ShortcutSection: React.FC<ShortcutSectionProps> = ({
  title,
  shortcuts,
}) => (
  <div>
    <h3 className="mb-2 text-xs font-medium tracking-wide text-composer-text-muted">
      {title}
    </h3>
    <div className="flex flex-col">
      {shortcuts.map((shortcut) => (
        <ShortcutItem
          key={shortcut.shortcutId ?? shortcut.description}
          {...shortcut}
        />
      ))}
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { formatKey, KeyBadge, ShortcutSection, getShortcutSections };
