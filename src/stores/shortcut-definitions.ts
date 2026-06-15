// -- Types --------------------------------------------------------------------

import { t } from "i18next";

interface ShortcutBinding {
  key: string;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  mod?: boolean;
}

type ShortcutScope = "global" | "sync" | "timeline";

interface ShortcutDefinition {
  id: string;
  scope: ShortcutScope;
  description: string;
  defaultBinding: ShortcutBinding;
}

// -- Registry -----------------------------------------------------------------

const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  {
    id: "global.playPause",
    scope: "global",
    description: t("Play / Pause"),
    defaultBinding: { key: "Enter" },
  },
  {
    id: "global.help",
    scope: "global",
    description: t("Show help"),
    defaultBinding: { key: "?", shift: true },
  },
  {
    id: "global.settings",
    scope: "global",
    description: t("Open settings"),
    defaultBinding: { key: "," },
  },
  {
    id: "global.panicRecovery",
    scope: "global",
    description: t("Download saved work (panic shortcut)"),
    defaultBinding: { key: "e", mod: true, shift: true, alt: true },
  },
  {
    id: "global.goToImport",
    scope: "global",
    description: t("Go to Import"),
    defaultBinding: { key: "1", mod: true },
  },
  {
    id: "global.goToEdit",
    scope: "global",
    description: t("Go to Edit"),
    defaultBinding: { key: "2", mod: true },
  },
  {
    id: "global.goToSync",
    scope: "global",
    description: t("Go to Sync"),
    defaultBinding: { key: "3", mod: true },
  },
  {
    id: "global.goToTimeline",
    scope: "global",
    description: t("Go to Timeline"),
    defaultBinding: { key: "4", mod: true },
  },
  {
    id: "global.goToPreview",
    scope: "global",
    description: t("Go to Preview"),
    defaultBinding: { key: "5", mod: true },
  },
  {
    id: "global.goToExport",
    scope: "global",
    description: t("Go to Export"),
    defaultBinding: { key: "6", mod: true },
  },
  {
    id: "sync.tap",
    scope: "sync",
    description: t("Tap to sync"),
    defaultBinding: { key: " " },
  },
  {
    id: "sync.holdSync",
    scope: "sync",
    description: t("Hold to sync"),
    defaultBinding: { key: "f" },
  },
  {
    id: "sync.nudgeLeft",
    scope: "sync",
    description: t("Nudge left"),
    defaultBinding: { key: "ArrowLeft" },
  },
  {
    id: "sync.nudgeRight",
    scope: "sync",
    description: t("Nudge right"),
    defaultBinding: { key: "ArrowRight" },
  },
  {
    id: "timeline.toggleFollow",
    scope: "timeline",
    description: t("Toggle follow"),
    defaultBinding: { key: "f" },
  },
  {
    id: "timeline.togglePreview",
    scope: "timeline",
    description: t("Toggle preview"),
    defaultBinding: { key: "p" },
  },
  {
    id: "timeline.insertLineBelow",
    scope: "timeline",
    description: t("Insert line below"),
    defaultBinding: { key: "n" },
  },
  {
    id: "timeline.insertLineAbove",
    scope: "timeline",
    description: t("Insert line above"),
    defaultBinding: { key: "n", shift: true },
  },
  {
    id: "timeline.jumpToPlayhead",
    scope: "timeline",
    description: t("Jump to playhead"),
    defaultBinding: { key: " " },
  },
  {
    id: "timeline.selectWordAtPlayhead",
    scope: "timeline",
    description: t("Select word under playhead"),
    defaultBinding: { key: "a" },
  },
  {
    id: "timeline.setWordBegin",
    scope: "timeline",
    description: t("Set word begin"),
    defaultBinding: { key: "[" },
  },
  {
    id: "timeline.setWordEnd",
    scope: "timeline",
    description: t("Set word end"),
    defaultBinding: { key: "]" },
  },
  {
    id: "timeline.editWord",
    scope: "timeline",
    description: t("Edit word"),
    defaultBinding: { key: "e" },
  },
  {
    id: "timeline.splitSyllable",
    scope: "timeline",
    description: t("Split syllable"),
    defaultBinding: { key: "s" },
  },
  {
    id: "timeline.splitWord",
    scope: "timeline",
    description: t("Split word into words"),
    defaultBinding: { key: "s", shift: true },
  },
  {
    id: "timeline.mergeWords",
    scope: "timeline",
    description: t("Merge words"),
    defaultBinding: { key: "m" },
  },
  {
    id: "timeline.mergeSyllablesIntoWord",
    scope: "timeline",
    description: t("Merge syllables back into one word"),
    defaultBinding: { key: "y" },
  },
  {
    id: "timeline.splitIntoWords",
    scope: "timeline",
    description: t("Split line into words"),
    defaultBinding: { key: "w" },
  },
  {
    id: "timeline.expandAll",
    scope: "timeline",
    description: t("Expand all lines"),
    defaultBinding: { key: "x" },
  },
  {
    id: "timeline.importLyrics",
    scope: "timeline",
    description: t("Import lyrics"),
    defaultBinding: { key: "v", mod: true, shift: true },
  },
  {
    id: "timeline.createGroup",
    scope: "timeline",
    description: t("Group selected lines"),
    defaultBinding: { key: "g", mod: true },
  },
  {
    id: "timeline.duplicateAsLinked",
    scope: "timeline",
    description: t("Duplicate as linked instance"),
    defaultBinding: { key: "d", mod: true },
  },
  {
    id: "timeline.toggleCollapseInstance",
    scope: "timeline",
    description: t("Collapse / expand current instance"),
    defaultBinding: { key: "c" },
  },
  {
    id: "timeline.toggleAllCollapsed",
    scope: "timeline",
    description: t("Collapse / expand all instances"),
    defaultBinding: { key: "c", shift: true },
  },
  {
    id: "timeline.jumpPrevInstance",
    scope: "timeline",
    description: t("Jump to previous instance of group"),
    defaultBinding: { key: "j", mod: true },
  },
  {
    id: "timeline.jumpNextInstance",
    scope: "timeline",
    description: t("Jump to next instance of group"),
    defaultBinding: { key: "k", mod: true },
  },
  {
    id: "timeline.detachInstance",
    scope: "timeline",
    description: t("Detach current instance from group"),
    defaultBinding: { key: "d", mod: true, shift: true },
  },
  {
    id: "timeline.deleteGroup",
    scope: "timeline",
    description: t("Delete current group"),
    defaultBinding: { key: "g", mod: true, shift: true },
  },
  {
    id: "timeline.pingSiblings",
    scope: "timeline",
    description: t("Ping sibling instances"),
    defaultBinding: { key: "h" },
  },
  {
    id: "timeline.shiftInstanceToPlayhead",
    scope: "timeline",
    description: t("Shift current instance to playhead"),
    defaultBinding: { key: "p", shift: true },
  },
  {
    id: "timeline.jumpToInstanceStart",
    scope: "timeline",
    description: t("Jump to start of current instance"),
    defaultBinding: { key: "j", shift: true },
  },
  {
    id: "timeline.nudgeLeft",
    scope: "timeline",
    description: t("Nudge selected words left"),
    defaultBinding: { key: "ArrowLeft" },
  },
  {
    id: "timeline.nudgeRight",
    scope: "timeline",
    description: t("Nudge selected words right"),
    defaultBinding: { key: "ArrowRight" },
  },
  {
    id: "timeline.toggleExplicit",
    scope: "timeline",
    description: t("Toggle explicit on selected word(s)"),
    defaultBinding: { key: "e", shift: true },
  },
  {
    id: "timeline.toggleSnap",
    scope: "timeline",
    description: t("Toggle snap (magnet)"),
    defaultBinding: { key: "t" },
  },
  {
    id: "timeline.toggleRollingEdit",
    scope: "timeline",
    description: t("Toggle rolling edit tool"),
    defaultBinding: { key: "r" },
  },
];

// -- Exports ------------------------------------------------------------------

export { SHORTCUT_DEFINITIONS };
export type { ShortcutBinding, ShortcutScope, ShortcutDefinition };
