import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { MOD_KEY } from "@/utils/platform";
import { t } from "i18next";

// -- Syncing ------------------------------------------------------------------

const SyncSection: React.FC = () => (
  <div className="space-y-5">
    <p className={PROSE}>
      {t(
        "The Sync tab shows your lyrics as a scrolling carousel. One line is active at a time, with each word waiting to be synced. You have two keys available, and you can use them freely in combination.",
      )}
    </p>

    <div>
      <h4 className={HEADING}>{t("Tap (Space)")}</h4>
      <p className={PROSE}>
        {t("Press")} <InlineKeyBadge keys={getEffectiveKeysArray("sync.tap")} />{" "}
        {t(
          "to start playback and begin syncing. As the music plays, tap",
        )}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.tap")} />{" "}
        {t(
          "on each word right when the singer says it. Each tap marks the word's start time, and the previous word's end time is set to the same moment, creating gapless transitions.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Hold (F)")}</h4>
      <p className={PROSE}>
        {t("Press and hold")}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.holdSync")} />{" "}
        {t(
          "for the duration of each word. The key-down marks the word's start, and key-up marks the end. This gives you explicit control over word duration and allows natural gaps between words. The current word highlights while you hold.",
        )}
      </p>
      <p className={`${PROSE} mt-2`}>
        {t("For words with natural gaps between them, just hold and release for each word:")}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>{t('Hold F: "hello" starts')}</li>
        <li>{t('Release F: "hello" ends')}</li>
        <li>{t("(wait for gap)")}</li>
        <li>{t('Hold F: "world" starts')}</li>
        <li>{t('Release F: "world" ends')}</li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Gapless syllables (Hold F + Tap Space)")}</h4>
      <p className={PROSE}>
        {t("For syllables that flow together without pauses, tap")}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.tap")} />{" "}
        {t("while holding")}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.holdSync")} />{" "}
        {t(
          "to create gapless boundaries. Each tap ends the current syllable and immediately starts the next. Release",
        )}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.holdSync")} />{" "}
        {t("to end the last one:")}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>{t('Hold F: "beau" starts')}</li>
        <li>{t('Tap Space (still holding F): "beau" ends, "ti" starts at the same moment')}</li>
        <li>{t('Tap Space (still holding F): "ti" ends, "ful" starts at the same moment')}</li>
        <li>{t('Release F: "ful" ends')}</li>
      </ul>
      <p className={`${PROSE} mt-2`}>
        {t(
          "You can mix all styles naturally within the same line. Use hold-release for standalone words, tap for quick gapless words, and hold+tap for connected syllables:",
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>{t('Hold F, release F: "oh" gets its own timing')}</li>
        <li>{t("(gap)")}</li>
        <li>{t('Hold F: "beau" starts')}</li>
        <li>{t('Tap Space, tap Space: gapless boundaries for "ti" and "ful"')}</li>
        <li>{t('Release F: "ful" ends')}</li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Made a mistake?")}</h4>
      <p className={PROSE}>
        {t("Press")}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.nudgeLeft")} />{" "}
        {t("to nudge the last synced word 50ms earlier.")}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("sync.nudgeRight")} />{" "}
        {t("nudges it 50ms later. You can also press {{shortcut}} to undo. Each hold produces two undo steps (start and end) so you can step back precisely.", {
          shortcut: `${MOD_KEY} + Z`,
        })}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Line-level vs word-level")}</h4>
      <p className={PROSE}>
        {t(
          "By default, you're syncing word by word. The granularity toggle at the top lets you switch to line-level if you only need rough timing.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Re-syncing a line")}</h4>
      <p className={PROSE}>
        {t(
          "If a whole line went wrong, just navigate back to it and sync again. New taps overwrite old timing.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Splitting syllables")}</h4>
      <p className={PROSE}>
        {t(
          "Each word on the active line has a small scissors button. Click it to split that word into syllables right here, without switching to the Timeline. A popover opens where you click between letters to mark the split points, then confirm. The Timeline splitter offers the same syllable split plus a word-mode split.",
        )}
      </p>
    </div>

    <p className={PROSE}>
      {t(
        "After syncing, your words have timing data. The Sync tab works at the line or word level, but for precise per-word timing adjustments, Timeline is where you drag, resize, and snap individual word blocks. Head there for fine-tuning, or go straight to Preview to see how it looks.",
      )}
    </p>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { SyncSection };
