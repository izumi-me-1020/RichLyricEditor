import { PROSE } from "@/ui/help-sections/shared";
import { t } from "i18next";

// -- Preview ------------------------------------------------------------------

const PreviewSection: React.FC = () => (
  <div className="space-y-4">
    <p className={PROSE}>
      {t("The Preview tab shows you how your synced lyrics will look with")}{" "}
      <a
        href="https://richlyric.izumy.me"
        target="_blank"
        rel="noopener noreferrer"
        className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
      >
        {t("RichLyric")}
      </a>
      {t(
        "' rendering engine. Words fill in progressively as they're sung, matching the timing you set.",
      )}
    </p>
    <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
      <li>
        {t(
          "Agent lines are positioned based on their inferred location (left, right, center).",
        )}
      </li>
      <li>
        {t("Background vocals appear below the main line in a smaller style.")}
      </li>
      <li>
        {t(
          "Use this to spot timing issues. If a word highlights too early or too late, go back to Timeline and adjust.",
        )}
      </li>
      <li>
        {t(
          "Playback controls (play/pause, seek) work the same as everywhere else.",
        )}
      </li>
      <li>
        {t(
          "Instrumental sections appear automatically wherever there's a gap longer than 5 seconds between sung lines. RichLyric handles this at render time. You can't add them manually or preview them here, just trust that they'll show up in the final output.",
        )}
      </li>
    </ul>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { PreviewSection };
