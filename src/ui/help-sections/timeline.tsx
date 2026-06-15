import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { TimelineExtras } from "@/ui/help-sections/timeline-extras";
import { ALT_KEY, MOD_KEY } from "@/utils/platform";
import { t } from "i18next";

// -- Timeline -----------------------------------------------------------------

const TimelineSection: React.FC = () => (
  <div className="space-y-5">
    <p className={PROSE}>
      {t(
        "The Timeline is where you do the detailed work. While the Sync tab is great for tapping out rough timing, Timeline gives you full control over every word. You can drag words to reposition them, resize their boundaries, split words and syllables, merge blocks, mark explicit words, copy and paste across lines, and more. If you've used a DAW or video editor before, this will feel familiar.",
      )}
    </p>

    <div>
      <h4 className={HEADING}>{t("Layout")}</h4>
      <p className={PROSE}>
        {t(
          "The waveform sits at the top. Below it, each lyrics line is a horizontal track. Word blocks sit on the tracks, positioned by their start and end times. The playhead (vertical line) follows the audio. The gutter on the left shows line numbers and agent colors. Click it to assign agents.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Navigation")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "A plain scroll wheel scrolls vertically through the lines. To move through time, scroll horizontally with a trackpad gesture.",
          )}
        </li>
        <li>
          {t(
            'Turn on "Scroll wheel scrolls timeline" in Settings, under Timeline, to swap the axes: a plain wheel then scrolls the timeline horizontally and Shift + wheel scrolls vertically.',
          )}
        </li>
        <li>
          {t(
            'Scroll the wheel while the cursor is over the waveform strip to scrub the playhead through time, and the view follows it. This works whichever way the "Scroll wheel scrolls timeline" setting is set.',
          )}
        </li>
        <li>
          {t(
            "{{modKey}} + scroll wheel to zoom in and out. Zoom anchors under the cursor. The header zoom buttons (and the shortcuts they expose) anchor on the playhead when it's on screen, and on the viewport center otherwise.",
            { modKey: MOD_KEY },
          )}
        </li>
        <li>
          {t(
            "Middle-click and drag to pan freely. Hold Shift while middle-dragging to lock panning to one axis.",
          )}
        </li>
        <li>
          {t(
            "Drag the playhead near the left or right edge of the viewport and the view auto-scrolls in that direction, so you can scrub the playhead past what is currently visible.",
          )}
        </li>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleFollow")}
          />{" "}
          {t(
            'to toggle "follow playhead" so the view scrolls automatically during playback.',
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Audio scrub preview")}</h4>
      <p className={PROSE}>
        {t(
          "When you scrub the playhead (drag it, or scroll the wheel over the waveform), RichLyricEditor plays a short bit of audio at the playhead position, at normal pitch. It helps you find a specific word by ear without having to press play. Faster scrubs play more snippets, slower scrubs play fewer. The preview matches your main volume and stays silent when the audio is muted. If it gets in the way, turn it off in Settings, under Playback.",
        )}
      </p>
      <p className={`${PROSE} mt-2`}>
        {t(
          `If you've separated the song into stems, scrubbing follows the stem you have selected: pick "Vocals" from the stem dropdown and the scrub previews vocals only, which makes it much easier to pin down a syllable boundary. The full track plays back as normal regardless of the stem choice.`,
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Selecting words")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "Click a word block to select it. {{modKey}} + Click to add or remove from selection.",
            {
              modKey: MOD_KEY,
            },
          )}
        </li>
        <li>
          {t(
            "Shift + Click a syllable to select every syllable in that word's group at once.",
          )}
        </li>
        <li>
          {t("Click and drag on empty space to marquee-select multiple words.")}
        </li>
        <li>{t("Hold Shift while dragging to add to existing selection.")}</li>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.selectWordAtPlayhead")}
          />{" "}
          {t(
            "to select the word at the current playhead time. Press it again to cycle through any overlapping words, such as a background-track word or stacked instances.",
          )}
        </li>
        <li>
          {t("Press")} <strong>{t("Escape")}</strong>{" "}
          {t("to deselect everything.")}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Editing words")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "Double-click a word block to edit its text inline. Press Enter to confirm, Escape to cancel.",
          )}
        </li>
        <li>
          {t(
            "Double-click on empty track space to create a new word at that position.",
          )}
        </li>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.editWord")} />{" "}
          {t("with a word selected to start editing.")}
        </li>
        <li>
          {t("Use")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.setWordBegin")}
          />{" "}
          {t("and")}{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.setWordEnd")} />{" "}
          {t("to snap a word's start or end to the current playhead position.")}
        </li>
        <li>
          {t("With one or more words selected, press")}{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.nudgeLeft")} />{" "}
          /{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.nudgeRight")} />{" "}
          {t(
            "to nudge them as a group. Each word keeps its duration, and the nudge stops at the neighboring word so nothing overlaps.",
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Copy, cut, paste")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "{{modKey}} + C / X / V work as expected. When you paste, a ghost preview appears. Click to place the pasted words.",
            {
              modKey: MOD_KEY,
            },
          )}
        </li>
        <li>
          {t("{{altKey}} + drag selected words to duplicate them.", {
            altKey: ALT_KEY,
          })}
        </li>
        <li>{t("Press Delete or Backspace to remove selected words.")}</li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Moving words across lines and tracks")}</h4>
      <p className={PROSE}>
        {t(
          "Grab a word block and drop it on a different line, or on the background track of the same line, to relocate it. Multi-select moves them as a group: every selected word follows the dragged one, keeping its relative offset. Linked syllables stay together.",
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>
          {t(
            'The drop falls back to a "reorder within the same row" when you keep it on the source line, so the same drag handles both cases.',
          )}
        </li>
        <li>
          {t(
            "A drop is refused if it would overlap an existing word on the target track, if the target is line-synced (it has no word slots to land in), or if it would break a linked-group instance. The toast tells you which.",
          )}
        </li>
        <li>
          {t(
            "Moves into the background track convert the word's role; the destination line picks up",
          )}{" "}
          <strong>x-bg</strong> {t("markup at export.")}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Boundary dragging")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "Two syllables that sit flush share one boundary: drag either edge and both move together, staying flush. Once a gap opens between them, each edge drags on its own so you can resize a syllable without closing the gap.",
          )}
        </li>
        <li>
          {t(
            "Hold {{altKey}} while dragging to flip the current mode: flush syllables open a gap, gapped syllables snap back together, and separate words move as one.",
            { altKey: ALT_KEY },
          )}
        </li>
        <li>
          {t("You can toggle {{altKey}} mid-drag to switch modes on the fly.", {
            altKey: ALT_KEY,
          })}
        </li>
        <li>
          {t("Turn on")} <strong>{t("Rolling")}</strong>{" "}
          {t("in the toolbar (or press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleRollingEdit")}
          />{" "}
          {t(
            "for rolling edits. When it's on, dragging a flush boundary between two words moves both words together: the shared boundary shifts, the outer edges stay put, and the combined duration is preserved. {{altKey}} still inverts conjoin for that one drag.",
            { altKey: ALT_KEY },
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Snap (magnet)")}</h4>
      <p className={PROSE}>
        {t(
          "Drag or resize a word and its edges lock onto nearby anchors: the begin and end of any other word (main or background track), line edges for line-synced lines, and the playhead. A yellow halo appears on the moving block while snapped, and a thin dashed line marks the anchor on the timeline.",
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.toggleSnap")} />{" "}
          {t(
            "or click the magnet button in the toolbar to toggle snap. The setting persists across sessions.",
          )}
        </li>
        <li>
          {t(
            "Hold {{modKey}} mid-drag to bypass snap. The toolbar magnet dims while bypass is active. Release the key and snap re-engages.",
            { modKey: MOD_KEY },
          )}
        </li>
        <li>
          {t(
            "Adjust the snap distance in Settings, under Timeline. Range is 4 to 24 pixels, default 12.",
          )}
        </li>
        <li>
          {t(
            "Snap won't push a block into a neighbor. If the closest anchor would cause overlap, it falls through to the next-best anchor or doesn't snap at all.",
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Splitting and merging")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.splitSyllable")}
          />{" "}
          {t(
            "with a word selected to open the splitter in syllable mode. Click between letters to mark where the word should break. The result is a linked syllable group: the pieces stay tied together as one word. If the playhead is on the word when you confirm a single split, the timing boundary snaps to the playhead position exactly.",
          )}
        </li>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.splitWord")} />{" "}
          {t("(or right-click and pick")} <strong>{t("Split word")}</strong>
          {t(
            ") to open the splitter in word mode. This breaks one word into separate independent words, joined by a space, rather than a linked syllable group.",
          )}
        </li>
        <li>
          {t(
            "To undo a syllable split, right-click any syllable of the word and pick",
          )}{" "}
          <strong>{t("Merge syllables")}</strong>
          {t(", or press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.mergeSyllablesIntoWord")}
          />
          .
          {t(
            " The syllable group collapses back into one plain word that spans from the first syllable's start to the last syllable's end.",
          )}
        </li>
        <li>
          {t("Select two or more adjacent words on the same line and press")}{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.mergeWords")} />{" "}
          {t(
            "to merge them into one block. This works even when the selected words have a space between them; the joining space is dropped.",
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Syllable timing")}</h4>
      <p className={PROSE}>
        {t(
          "Syllables of a word can be timed flush against each other or with gaps between them. Gaps are useful for staccato or rap delivery, and for per-character timing in Japanese, Chinese, or Korean lyrics. To close those gaps, right-click a syllable and pick",
        )}{" "}
        <strong>{t("Snap syllables flush")}</strong>
        {t(
          ". It pulls every syllable group on the line tight, so each syllable starts where the previous one ends. The item only shows up when a group has a gap, and there is no keyboard shortcut for it.",
        )}
      </p>
    </div>

    <TimelineExtras />
  </div>
);

// -- Exports ------------------------------------------------------------------

export { TimelineSection };
