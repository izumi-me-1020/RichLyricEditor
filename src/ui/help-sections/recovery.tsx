import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { t } from "i18next";

// -- Recovery -----------------------------------------------------------------

const RecoverySection: React.FC = () => (
  <div className="space-y-5">
    <p className={PROSE}>
      {t(
        "RichLyricEditor saves your work as you go. If the app crashes, freezes, or you accidentally close the tab, your lyrics and timing are still there. Here's how to get them back.",
      )}
    </p>

    <div>
      <h4 className={HEADING}>{t("The app showed an error")}</h4>
      <p className={PROSE}>
        {t("Hit")} <strong>{t("Download my work")}</strong>{" "}
        {t(
          "on the error screen. You'll get a project file. Reload RichLyricEditor, head to the Export tab, and click",
        )}{" "}
        <strong>{t("Import Project")}</strong>{" "}
        {t("to pick up where you left off.")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("The app is frozen")}</h4>
      <p className={PROSE}>
        {t("Open")}{" "}
        <a
          href="/recover"
          target="_blank"
          rel="noopener noreferrer"
          className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
        >
          /recover
        </a>{" "}
        {t(
          "in a new tab. It's a tiny page that fetches your work without loading anything else, so it still works when nothing else does. Worth bookmarking.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Shortcut")}</h4>
      <p className={PROSE}>
        <InlineKeyBadge keys={getEffectiveKeysArray("global.panicRecovery")} />
        {t(
          "app. Handy when things look weird but aren't fully stuck. If the whole tab is frozen, use the /recover tab approach instead.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("What's in the backup")}</h4>
      <p className={PROSE}>
        {t(
          "Lyrics, timing, agents, groups, and project metadata. Audio doesn't carry over (files are too big), so you'll drop that back in yourself. Everything stays on your device, nothing's uploaded.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Nothing showed up?")}</h4>
      <p className={PROSE}>
        {t(
          "Backups are tied to the browser you used. They won't show up in a different browser, a different profile, or a private window. If you cleared browser data after the crash, sadly it's gone.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Still crashing after reload?")}</h4>
      <p className={PROSE}>
        {t(
          "Sometimes the saved data itself is the issue. After downloading the backup, the same screen (error page or /recover) shows a",
        )}{" "}
        <strong>{t("Clear saved data")}</strong>{" "}
        {t(
          "button. It wipes the autosave so RichLyricEditor opens fresh next time. Import the file back whenever you're ready. If you can still get into the app, the Export tab's",
        )}{" "}
        <strong>{t("Clear")}</strong> {t("button does the same thing.")}
      </p>
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { RecoverySection };
