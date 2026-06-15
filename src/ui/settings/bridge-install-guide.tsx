import { useState } from "react";
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/ui/button";
import { Scroll } from "@/ui/scroll";
import { t } from "i18next";

// -- Constants ----------------------------------------------------------------

const REPO_URL = "https://github.com/izumi-me-1020/RichLyricEditor-bridge";
const RELEASES_URL = `${REPO_URL}/releases/latest`;
const INSTALL_CMD = `curl -fsSL ${RELEASES_URL}/download/install.sh | sh`;
const COPIED_RESET_MS = 1800;

// -- Sub-components -----------------------------------------------------------

const StepHeader: React.FC<{ index: number; title: string }> = ({
  index,
  title,
}) => (
  <div className="flex items-baseline gap-2">
    <span className="text-xs font-mono text-composer-text-muted w-4">
      {index}.
    </span>
    <h3 className="text-sm font-medium text-composer-text">{title}</h3>
  </div>
);

const InstallCommand: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch (err: unknown) {
      console.error("clipboard write failed", err);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-composer-bg-dark border border-composer-border">
      <Scroll className="flex-1 min-w-0" autoHide="leave">
        <code className="block font-mono text-[11px] text-composer-text-secondary select-text whitespace-nowrap">
          {INSTALL_CMD}
        </code>
      </Scroll>
      <Button
        variant="secondary"
        size="sm"
        hasIcon
        onClick={copy}
        aria-label={t("Copy install command")}
      >
        {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
        {copied ? t("Copied") : t("Copy")}
      </Button>
    </div>
  );
};

// -- Component ----------------------------------------------------------------

interface BridgeInstallGuideProps {
  onCheckNow: () => void;
}

const BridgeInstallGuide: React.FC<BridgeInstallGuideProps> = ({
  onCheckNow,
}) => (
  <div className="flex flex-col gap-3 text-xs text-composer-text-muted leading-relaxed">
    <div className="flex flex-col gap-1.5">
      <StepHeader index={1} title={t("Install")} />

      <p>
        {t(
          "Open Terminal (macOS or Linux) and paste the command below to install",
        )}{" "}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-composer-text"
        >
          RichLyricEditor Bridge
        </a>
        .{" "}
        {t(
          "It picks the right build for your machine, verifies the checksum, and installs to",
        )}{" "}
        <code className="font-mono text-[11px] px-1 bg-composer-bg rounded">
          /Applications
        </code>{" "}
        {t("on Mac or")}{" "}
        <code className="font-mono text-[11px] px-1 bg-composer-bg rounded">
          ~/.local/bin
        </code>{" "}
        {t("on Linux.")}
      </p>
      <InstallCommand />
      <a
        href={RELEASES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-composer-accent-text underline underline-offset-2 transition-colors hover:text-composer-accent w-fit inline-flex items-center gap-1"
      >
        {t("Windows or manual download")}
        <IconExternalLink size={11} />
      </a>
    </div>

    <div className="flex flex-col gap-1.5">
      <StepHeader index={2} title={t("Launch")} />

      <p>
        {t(
          "Open RichLyricEditor Bridge. The app runs in the background. Look for its icon in your menu bar (Mac) or system tray (Windows or Linux). Leave it running.",
        )}
      </p>
    </div>

    <div className="flex flex-col gap-1.5">
      <StepHeader index={3} title={t("Return here")} />

      <p>
        {t(
          "Once the bridge is running, this card goes green automatically. No restart needed.",
        )}
      </p>

      <Button
        variant="secondary"
        size="sm"
        hasIcon
        onClick={onCheckNow}
        className="mt-2 w-fit"
      >
        <IconRefresh size={12} />
        {t("Check now")}
      </Button>
    </div>
  </div>
);

// -- Exports ------------------------------------------------------------------

export { BridgeInstallGuide };
export type { BridgeInstallGuideProps };
