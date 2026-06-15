import { PROSE } from "@/ui/help-sections/shared";
import { t } from "i18next";

// -- Exporting ----------------------------------------------------------------

const ExportSection: React.FC = () => (
  <div className="space-y-5">
    <p className={PROSE}>
      {t("The Export tab shows a syntax-highlighted preview of your TTML output.")}
    </p>
    <ul className={`${PROSE} list-disc pl-4 space-y-1.5`}>
      <li>
        <strong>{t("Download TTML")}</strong>:{" "}
        {t("Saves the file to your computer. The filename uses your project title.")}
      </li>
      <li>
        <strong>{t("Copy")}</strong>: {t("Copies the minified TTML to your clipboard.")}
      </li>
      <li>
        <strong>{t("Edit")}</strong>:{" "}
        {t(
          'Lets you manually tweak the XML before downloading. Click "Regenerate" to go back to the auto-generated version.',
        )}
      </li>
      <li>
        <strong>{t("Project files")}</strong>:{" "}
        {t(
          'Use "Export Project" to save a .json file with all your data (lyrics, timing, agents, metadata). Use "Import Project" to load one back. This is how you share work with collaborators or back things up.',
        )}
      </li>
      <li>
        <strong>{t("Clear")}</strong>:{" "}
        {t("Wipes the current project. This is permanent, so it asks for confirmation.")}
      </li>
    </ul>
    <p className={PROSE}>
      {t(
        "The counter at the top shows how many lines have timing data. Unsynced lines are skipped in the export.",
      )}
    </p>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { ExportSection };
