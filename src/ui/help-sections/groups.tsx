import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, INLINE_CODE, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { MOD_KEY } from "@/utils/platform";
import { t } from "i18next";

// -- Linked Groups ------------------------------------------------------------

const GroupsSection: React.FC = () => (
  <div className="space-y-5">
    <p className={PROSE}>
      {t(
        "A group is a set of contiguous lines that repeat in the song (chorus, verse, bridge). Group them once and edits to text, splits, agents, or background vocals propagate to every instance. Each instance still owns its own absolute timing, so you can shift one chorus by 5 seconds without moving the others.",
      )}
    </p>

    <div>
      <h4 className={HEADING}>{t("Why bother")}</h4>
      <p className={PROSE}>
        {t(
          "If your song repeats the chorus four times, you'd otherwise edit four copies of every lyric tweak. Group them and a fix in one place lands in all four. Same for splitting a syllable, switching a word to background vocals, or reassigning an agent.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Creating a group")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "Select the lines you want to group (click, then Shift-click the last line, or drag down the gutter).",
          )}
        </li>
        <li>
          {t("Press")}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.createGroup")}
          />
          {t(', or right-click any selected line and pick "Group N lines".')}
        </li>
        <li>
          {t(
            "If your selection skips a line by accident, RichLyricEditor fills the gap and tells you so in the toast. If a line in the gap already belongs to another group, it refuses and asks you to fix the selection.",
          )}
        </li>
        <li>
          {t(
            "The new group gets a color from the palette and shows up as a banner above the first line.",
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Adding more instances")}</h4>
      <p className={PROSE}>
        {t("Click the banner of the instance you want to copy, then press")}{" "}
        <InlineKeyBadge
          keys={getEffectiveKeysArray("timeline.duplicateAsLinked")}
        />{" "}
        {t(
          '(or right-click the banner and pick "Add instance at playhead"). RichLyricEditor picks one of three landings, in this order:',
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          <strong>{t("Fills empty placeholder rows in place")}</strong>{" "}
          {t(
            "if a matching run of empty rows sits right after the last timed line ending at or before the playhead. Nothing shifts down, the placeholders just light up.",
          )}
        </li>
        <li>
          <strong>{t("Inserts new rows at the playhead")}</strong>{" "}
          {t(
            "if there's no fillable run but the playhead falls in a clean time gap big enough for the instance.",
          )}
        </li>
        <li>
          <strong>
            {t(
              "Copies the instance to the clipboard and opens the paste-preview ghost",
            )}
          </strong>{" "}
          {t(
            `if the playhead is inside a playing line, the gap is too small, or you've already passed the last lyric. Toast says where to go next: "No room at the playhead. {{modKey}} + V to paste somewhere clear." Move the cursor to a row you like and click to drop it.`,
            { modKey: MOD_KEY },
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-2`}>
        {t(
          "You can also use the regular clipboard: select every word of an instance ({{modKey}} + C with the banner selected), then paste ({{modKey}} + V) somewhere else. Same fill/insert behavior at the destination.",
          { modKey: MOD_KEY },
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("The banner")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          <strong>{t("Click anywhere on it")}</strong>:{" "}
          {t(
            "selects every word in the instance. Use this before arrow-key nudge, {{modKey}} + C, or any of the keyboard shortcuts below.",
            { modKey: MOD_KEY },
          )}
        </li>
        <li>
          <strong>{t("Drag horizontally")}</strong>:{" "}
          {t(
            "shifts the entire instance in time. Sibling instances stay put. The lines move along with the banner so you can line things up by eye.",
          )}
        </li>
        <li>
          <strong>{t("Click the chevron")}</strong>:{" "}
          {t(
            "collapses the instance into a single strip. A faint progress bar fills the strip during playback so you can still tell where you are in the section.",
          )}
        </li>
        <li>
          <strong>{t("Right-click")}</strong>:{" "}
          {t(
            "opens the group menu (rename, recolor, add instance, shift to playhead, detach instance, delete group).",
          )}
        </li>
        <li>
          <strong>{t("Double-click anywhere on the header row")}</strong>:{" "}
          {t(
            "drops the gutter label into an inline input so you can rename the group. Enter saves, Escape cancels. The Rename item in the right-click menu does the same thing.",
          )}
        </li>
        <li>
          <strong>{t('Hover the "1 of N" badge')}</strong>:{" "}
          {t(
            "every sibling instance pings briefly with the group's color so you can spot them on the timeline. Or press",
          )}{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.pingSiblings")}
          />{" "}
          {t("for the same effect from the keyboard.")}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Keyboard shortcuts")}</h4>
      <p className={PROSE}>
        {t(
          'Most of these act on the instance containing your current selection. Click a banner first to "focus" an instance.',
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.createGroup")}
          />
          : {t("group selected lines.")}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.duplicateAsLinked")}
          />
          : {t("add a linked instance at the playhead.")}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleCollapseInstance")}
          />{" "}
          /{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.toggleAllCollapsed")}
          />
          : {t("collapse the current instance, or every instance.")}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.jumpPrevInstance")}
          />{" "}
          /{" "}
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.jumpNextInstance")}
          />
          :{" "}
          {t(
            "jump to the previous or next instance of the same group. Wraps around.",
          )}
        </li>
        <li>
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.nudgeLeft")} />{" "}
          /{" "}
          <InlineKeyBadge keys={getEffectiveKeysArray("timeline.nudgeRight")} />
          :{" "}
          {t(
            "nudge the current instance earlier or later by the nudge amount in Settings.",
          )}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.pingSiblings")}
          />
          : {t("ping every sibling instance.")}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.detachInstance")}
          />
          : {t("detach the current instance from the group.")}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.deleteGroup")}
          />
          : {t("delete the current group (asks for confirmation first).")}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.shiftInstanceToPlayhead")}
          />
          :{" "}
          {t(
            "shift the current instance so its first word lands on the playhead.",
          )}
        </li>
        <li>
          <InlineKeyBadge
            keys={getEffectiveKeysArray("timeline.jumpToInstanceStart")}
          />
          :{" "}
          {t(
            "scroll the timeline to the start of the current instance without changing the selection.",
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-2`}>
        {t("All of these are remappable in Settings -> Shortcuts.")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Suggestions banner")}</h4>
      <p className={PROSE}>
        {t(
          "When the timeline detects two or more contiguous runs of identical lines that aren't grouped yet, a small bulb banner appears under the toolbar. One suggestion shows inline with a Group them button. Multiple suggestions collapse into a Review N button that opens a modal with each block previewed and a per-row Group / dismiss action, plus a Group all button.",
        )}
      </p>
      <p className={`${PROSE} mt-2`}>
        {t(
          "Dismissals are per-project and content-based, so adding or removing unrelated lines elsewhere will not bring a suggestion back. Editing the actual text inside a dismissed block does, since the structure has changed.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Pasting between instances")}</h4>
      <p className={PROSE}>
        {t(
          "Two paste flows can land in an instance, and both behave the same way at the destination:",
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t(
            "Copy every word of an existing instance and paste somewhere. RichLyricEditor treats the clipboard as a known instance and links the destination automatically.",
          )}
        </li>
        <li>
          {t(
            'Copy every word of standalone lines whose text and word splits already match an existing template. RichLyricEditor asks "Link as another [Chorus]?". Yes links, No falls back to a regular word paste.',
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-2`}>
        {t(
          "In both cases the destination is filled in place if there are enough empty rows starting at the cursor. If there aren't, RichLyricEditor asks before inserting new rows, since that would shift everything below down by N. Add rows in the Edit view first if you want predictable layout.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("What propagates and what doesn't")}</h4>
      <p className={PROSE}>{t("Linked across all instances:")}</p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>{t("Word text and line text edits.")}</li>
        <li>{t("Agent assignments.")}</li>
        <li>{t("Background vocal text.")}</li>
        <li>
          {t(
            "Word splits and merges. Siblings get the new word structure, and RichLyricEditor keeps the timing of every word that didn't actually change. Only the split or merged word's slot is divided up. Sibling rhythms you carefully synced earlier survive.",
          )}
        </li>
        <li>{t("Moving a word between main and background tracks.")}</li>
      </ul>
      <p className={`${PROSE} mt-2`}>{t("Stays local to one instance:")}</p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>{t("Absolute begin and end times for each word.")}</li>
        <li>{t("Banner shifts and arrow-key nudge.")}</li>
        <li>{t("Anything you do on a line that's been detached.")}</li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("The split-or-merge prompt")}</h4>
      <p className={PROSE}>
        {t(
          "When a split or merge on a linked line would actually shift sibling word timings (sibling rhythms differ from the source), RichLyricEditor pops a three-button modal:",
        )}{" "}
        <strong>{t("Apply to all")}</strong>{" "}
        {t("(propagate with timing preservation),")}{" "}
        <strong>{t("Detach")}</strong>{" "}
        {t("(keep the change on this line only, unlink it from the group), or")}{" "}
        <strong>{t("Cancel")}</strong>
        {t(
          ". The modal stays out of the way when sibling rhythms already match the source, since propagation is a no-op for the unchanged words anyway.",
        )}
      </p>
      <p className={`${PROSE} mt-2`}>
        {t(
          `Tick "Don't ask again" in the modal to default to your choice next time. Reset the preference from`,
        )}{" "}
        <strong>{t("Settings -> Confirmations")}</strong>
        {t(".")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Detaching")}</h4>
      <p className={PROSE}>
        {t(
          `Real songs aren't perfectly repetitive. The last chorus might add an extra "yeah" or land on a different agent. Two ways to break the link:`,
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          {t("Right-click a line in the gutter and pick")}{" "}
          <strong>{t("Detach this line")}</strong>
          {t(
            ". That single line stops syncing with siblings; everything else stays linked.",
          )}
        </li>
        <li>
          {t("Right-click the banner and pick")}{" "}
          <strong>{t("Detach instance")}</strong>
          {t(
            ". The whole instance becomes plain standalone lines. Other instances keep their group.",
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-2`}>
        {t(
          "Both are undoable: the toast that appears has an Undo button, or press {{modKey}} + Z.",
          {
            modKey: MOD_KEY,
          },
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Emptying an instance")}</h4>
      <p className={PROSE}>
        {t("Click the banner to select every word in an instance, then press")}{" "}
        <strong>{t("Delete")}</strong>
        {t(
          ". RichLyricEditor clears the timed content and notices the instance is now empty across all its lines, so it strips the group attrs from those rows automatically. You're left with empty placeholders that the fill flow above can repopulate later. The other instances of the group are untouched.",
        )}
      </p>
      <p className={`${PROSE} mt-2`}>
        {t(
          "Partial deletes don't trigger this: if one line of a multi-line instance still has timed words, the instance stays linked.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Deleting a group")}</h4>
      <p className={PROSE}>
        {t("Right-click any banner and pick")}{" "}
        <strong>{t("Delete group")}</strong>
        {t(
          `. A confirmation modal warns you that all instances will become standalone (text and timing survive, they just stop syncing). Tick "Don't ask again" to skip the modal next time, or restore the prompt from`,
        )}{" "}
        <strong>{t("Settings -> Confirmations")}</strong>
        {t(".")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("How groups look outside the Timeline")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          <strong>{t("Edit view")}</strong>:{" "}
          {t(
            "a colored divider with the group name and instance count appears before each instance, plus a thin closing line at the end. Each grouped line also gets a left-edge stripe in the group color and a hover tooltip showing the link count.",
          )}
        </li>
        <li>
          <strong>{t("Sync view")}</strong>:{" "}
          {t(
            "the gutter cell shows a chain icon and an instance counter so you know which chorus you're syncing.",
          )}
        </li>
        <li>
          <strong>{t("TTML export")}</strong>:{" "}
          {t("groups round-trip via a custom")}{" "}
          <span className={INLINE_CODE}>composer:groups</span>{" "}
          {t(
            "registry plus per-line attributes. Other TTML players ignore them; RichLyricEditor reads them back exactly as saved.",
          )}
        </li>
      </ul>
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { GroupsSection };
