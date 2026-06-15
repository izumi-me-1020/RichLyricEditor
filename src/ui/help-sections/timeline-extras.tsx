import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, INLINE_CODE, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { MOD_KEY } from "@/utils/platform";
import { t } from "i18next";

// -- Timeline extras ----------------------------------------------------------

const TimelineExtras: React.FC = () => (
  <>
    <div>
      <h4 className={HEADING}>{t("Explicit words")}</h4>
      <p className={PROSE}>
        {t(
          "Mark a word as explicit so it carries the right flag through to export. Select one or more words and press",
        )}{" "}
        <InlineKeyBadge
          keys={getEffectiveKeysArray("timeline.toggleExplicit")}
        />{" "}
        {t(", or right-click and pick")}{" "}
        <strong>{t("Mark as explicit")}</strong> ({t("the same item reads")}{" "}
        <strong>{t("Unmark explicit")}</strong>{" "}
        {t("when the words are already flagged).")}
      </p>
      <p className={`${PROSE} mt-2`}>
        {t(
          "RichLyricEditor also scans your lyrics for likely explicit words and shows a suggestions banner above the timeline. From there you can mark a suggested word, mark them all, or dismiss ones that are false positives. Explicit words export as the",
        )}{" "}
        <span className={INLINE_CODE}>composer:explicit="true"</span>{" "}
        {t("attribute on the word's TTML span.")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Right-click menus")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "Right-click a word: Edit text, Split syllables, Split word. Merge words appears when multiple words are selected. On a word already split into syllables you also get Merge syllables and Snap syllables flush. Mark as explicit (or Unmark explicit) toggles the explicit flag. Group this line and Split into words show up when they apply, and Delete word is always there.",
          )}
        </li>
        <li>{t("Right-click empty track space: Add word here.")}</li>
        <li>
          {t(
            "Right-click the gutter: Add line above/below, Assign agent, Delete line.",
          )}
        </li>
        <li>
          {t(
            "Right-click a group banner: Add instance, Shift to playhead, Rename, Recolor, Detach instance, Delete group.",
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Linked groups")}</h4>
      <p className={PROSE}>
        {t(
          "Mark repeating sections (chorus, verse, bridge) as a group so structural edits fan out to every instance. See the",
        )}{" "}
        <strong>{t("Linked groups")}</strong>{" "}
        {t("section in this help modal for the full walkthrough.")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Header toolbar")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          <strong>{t("Follow")}</strong> (
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleFollow")}
          />
          ):{" "}
          {t(
            "auto-scrolls the view to keep the playhead visible during playback.",
          )}
        </li>
        <li>
          <strong>{t("Rolling")}</strong> (
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleRollingEdit")}
          />
          ):{" "}
          {t(
            "the rolling edit tool. When on, dragging a flush boundary moves both adjacent words together while keeping their combined duration.",
          )}
        </li>
        <li>
          <strong>{t("Preview")}</strong> (
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.togglePreview")}
          />
          ): {t("opens a live lyrics preview sidebar on the right.")}
        </li>
        <li>
          <strong>{t("Snap")}</strong> (
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.toggleSnap")} />
          ):{" "}
          {t(
            "a magnet for word edges and the playhead. Hold {{modKey}} mid-drag to bypass.",
            {
              modKey: MOD_KEY,
            },
          )}
        </li>
        <li>
          <strong>{t("Import")}</strong> (
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.importLyrics")}
          />
          ):{" "}
          {t(
            "imports lyrics directly into the Timeline without switching tabs.",
          )}
        </li>
        <li>
          <strong>{t("Zoom")}</strong>:{" "}
          {t(
            "use the +/- buttons or {{modKey}} + scroll wheel to zoom in and out. The header buttons keep the playhead pinned in place; scroll-wheel zoom pivots under the cursor.",
            { modKey: MOD_KEY },
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-3`}>
        {t(
          "Follow, Rolling, Preview, and Snap remember their state across reloads. Override the per-session default in Settings, under Timeline.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Other features")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.insertLineBelow")}
          />{" "}
          {t("with a word selected to insert a new empty line below it.")}
        </li>
        <li>
          {t(
            "The info panel at the bottom shows details for the selected word, including background text editing.",
          )}
        </li>
      </ul>
    </div>
  </>
);

// -- Exports ------------------------------------------------------------------

export { TimelineExtras };
