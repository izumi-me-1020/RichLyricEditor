import { HEADING, PROSE } from "@/ui/help-sections/shared";
import { t } from "i18next";

// -- About --------------------------------------------------------------------

const AboutSection: React.FC = () => (
  <div className="space-y-5">
    <div className="relative -mx-6 -mt-6">
      <div className="absolute inset-0 bg-gradient-to-b from-composer-accent/20 to-transparent pointer-events-none" />
      <div className="relative px-6 pt-7 pb-8 flex items-center gap-5">
        <img
          src="/logo.svg"
          alt={t("RichLyricEditor")}
          className="size-14 shrink-0"
        />
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">
            {t("RichLyricEditor")}
          </h2>
          <p className="text-sm text-composer-text-secondary">
            {t("The lyrics editor for RichLyric.")}
          </p>
          <p className="text-xs text-composer-text-muted font-mono mt-2">
            v{__APP_VERSION__}
          </p>
        </div>
      </div>
    </div>

    <div>
      <h4 className={HEADING}>{t("What it is")}</h4>
      <p className={PROSE}>
        {t(
          "Free and open-source, runs entirely in your browser. No accounts, nothing leaves your machine. Bring your audio and lyrics, sync them up, export TTML.",
        )}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Open source")}</h4>
      <p className={PROSE}>
        {t("AGPL v3. Source on")}{" "}
        <a
          href="https://github.com/izumi-me-1020/RichLyricEditor"
          target="_blank"
          rel="noopener noreferrer"
          className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
        >
          {t("GitHub")}
        </a>
        . {t("PRs welcome if you spot something to fix.")}
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Commercial use")}</h4>
      <p className={PROSE}>
        {t(
          "RichLyricEditor is based on Composer, an open-source project licensed under the AGPL. This editor includes modifications and additional features, but commercial use remains subject to Composer's licensing terms. If you require a commercial license, please contact",
        )}{" "}
        <a
          href="https://github.com/better-lyrics/composer"
          target="_black"
          className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
        >
          https://github.com/better-lyrics/composer
        </a>
        .
      </p>
    </div>

    <div>
      <h4 className={HEADING}>{t("Community")}</h4>
      <ul className={`${PROSE} list-disc pl-4 space-y-1`}>
        <li>
          <a
            href="https://github.com/izumi-me-1020/RichLyricEditor/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
          >
            {t("File an issue")}
          </a>{" "}
          {t("if something's broken.")}
        </li>
      </ul>
    </div>

    <div>
      <h4 className={HEADING}>{t("Made by")}</h4>
      <p className={PROSE}>
        {t("RichLyricEditor is a fork of")}{" "}
        <a
          href="https://github.com/better-lyrics/composer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-composer-text underline underline-offset-2 hover:text-composer-text-bright"
        >
          {t("Composer")}
        </a>
        {t(
          ", originally created by Boidu. This project includes modifications and additional features developed by RichLyric. Special thanks to the Composer contributors and community members whose work, feedback, bug reports, and support made this project possible.",
        )}
      </p>
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { AboutSection };
