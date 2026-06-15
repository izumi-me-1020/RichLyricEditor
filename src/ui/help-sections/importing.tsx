import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import { HEADING, INLINE_CODE, PROSE } from "@/ui/help-sections/shared";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { t } from "i18next";

// -- Importing ----------------------------------------------------------------

const ImportSection: React.FC = () => (
  <div className="space-y-5">
    <div>
      <h4 className={HEADING}>{t("Audio files")}</h4>
      <p className={PROSE}>
        {t("Supported formats: MP3, WAV, M4A, OGG, FLAC.")}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>
          {t(
            "Use the Import tab's drop zone, or drop a file directly onto the Timeline empty state.",
          )}
        </li>
        <li>
          {t("Once loaded, the waveform renders across the top of Timeline.")}
        </li>
        <li>{t("The file name auto-fills the project title in metadata.")}</li>
        <li>
          {t("To replace audio, just drop a new file on the Import tab.")}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("YouTube URLs")}</h4>
      <p className={PROSE}>
        {t(
          "Paste any YouTube link (full URL, share link, or just the video ID) into the Import tab. RichLyricEditor downloads the audio once and keeps it in memory, so seeking and waveform rendering stay instant after that.",
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>{t("The video title fills in as your project title.")}</li>
        <li>
          {t(
            "To swap videos, paste a new URL into the same input on the Import tab.",
          )}
        </li>
        <li>
          {t(
            "If a download fails, check that the URL is right and that the video is public.",
          )}
        </li>
        <li>
          {t(
            "A small number of videos won't download due to geo-restrictions or rights blocks. In that case, grab the audio some other way and drop the file into the Import tab.",
          )}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>
        {t("YouTube backends: Cobalt and RichLyricEditor Bridge")}
      </h4>
      <p className={PROSE}>
        {t(
          "YouTube audio doesn't come from YouTube directly. RichLyricEditor routes the request through a small backend service that fetches the audio and hands it back. There are two options.",
        )}
      </p>
      <p className={`${PROSE} mt-2`}>
        <strong>{t("Cobalt")}</strong>{" "}
        {t(
          "is the default. RichLyricEditor ships with a public instance that handles verification automatically, but YouTube is currently blocking it. To get unblocked, add a working instance from cobalt.directory in Settings → Advanced, or self-host. Each custom instance shows a small status icon next to its name reflecting the last attempt, with the actual error in the tooltip if anything went wrong.",
        )}
      </p>
      <p className={`${PROSE} mt-3`}>
        <strong>{t("RichLyricEditor Bridge")}</strong>
        <span className="ml-2 text-[10px] tracking-wide text-composer-accent-text">
          {t("Experimental")}
        </span>
        <br />
        {t(
          'A tiny binary you run on your own machine that downloads YouTube audio over your residential IP, so YouTube doesn\'t block it the way it blocks shared Cobalt hosts. RichLyricEditor talks to it over localhost; nothing leaves your machine. Toggle "RichLyricEditor Bridge for YouTube" on in Settings → Advanced and every YouTube import routes through the bridge instead of Cobalt.',
        )}
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>
          {t(
            "If the bridge isn't installed yet, an inline guide appears with a one-line install command for macOS and Linux, plus a link to the Windows download.",
          )}
        </li>
        <li>
          {t("Once installed, launch")}{" "}
          <span className={INLINE_CODE}>{t("RichLyricEditor Bridge")}</span>{" "}
          {t(
            "from your Applications folder or run the binary from a terminal. It lives in your menu bar (Mac) or system tray (Windows, Linux). Leave it running.",
          )}
        </li>
        <li>
          {t("The default URL is")}{" "}
          <span className={INLINE_CODE}>http://localhost:7777</span>.{" "}
          {t(
            `Change it in the bridge URL field if you're running on a different port, and hit "Reset" to restore the default.`,
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-3`}>
        {t("Sources, releases, and self-build instructions live on")}{" "}
        <a
          href="https://github.com/izumi-me-1020/RichLyricEditor-bridge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
        >
          {t("GitHub")}
        </a>
        .{" "}
        {t(
          "The install script verifies the release checksum before unpacking.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Lyrics files")}</h4>
      <p className={PROSE}>
        {t(
          "Open the lyrics modal from the import button in Edit or the Timeline header (or press",
        )}{" "}
        <InlineKeyBadge keys={getEffectiveKeysArray("timeline.importLyrics")} />{" "}
        in Timeline). It has three sections:
      </p>
      <ul className={`${PROSE} list-disc pl-4 mt-1.5 space-y-1`}>
        <li>
          <strong>{t("Search")}</strong>:{" "}
          {t(
            "queries LRCLib, Binimum, and RichLyric in parallel. Type a track or paste a video ID; artist, album, and duration narrow the results. Each row shows its sync precision (syllable, word, line, or unsynced) and how close its duration is to your project's.",
          )}
        </li>
        <li>
          <strong>{t("Paste")}</strong>: {t("drop in raw lyrics. Use")}{" "}
          <span className={INLINE_CODE}>|</span> {t("to split syllables (e.g.")}{" "}
          <span className={INLINE_CODE}>beau|ti|ful</span>).
        </li>
        <li>
          <strong>{t("Upload")}</strong>:{" "}
          {t(
            "drag a file in, or click to browse. Accepts .txt, .lrc, .srt, .ttml.",
          )}
        </li>
      </ul>
      <p className={`${PROSE} mt-3`}>
        {t(
          "In Edit, double-clicking the import button skips the modal and opens the file picker directly, like the old flow.",
        )}
      </p>
      <p className={`${PROSE} mt-3`}>
        {t(
          "Supported formats: .txt (plain text), .lrc (line-level timing), .srt (subtitles), .ttml (full timing + agents). Imported timing is preserved; plain .txt files get none and you sync them manually.",
        )}
      </p>
      <p className={`${PROSE} mt-3`}>
        {t("If RichLyricEditor was opened with")}{" "}
        <span className={INLINE_CODE}>
          ?title=…&amp;artist=…&amp;duration=…&amp;videoId=…
        </span>{" "}
        query params (for
        {t(
          'example from the RichLyric extension), the values stick around and pre-fill the next time you open the modal. Clear them with "Reset fields" in the Search section.',
        )}
      </p>
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { ImportSection };
