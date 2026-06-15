import { clearRecoveryStorage } from "@/lib/recovery";
import { Button } from "@/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";

// -- Constants ----------------------------------------------------------------

const LOG_PREFIX = "[ClearRecovery]";

// -- Types --------------------------------------------------------------------

type ClearStatus = "idle" | "confirm" | "clearing" | "cleared" | "failed";

interface ClearRecoveryButtonProps {
  hint?: string;
  clearedMessage?: string;
}

// -- Component ----------------------------------------------------------------

const ClearRecoveryButton: React.FC<ClearRecoveryButtonProps> = ({
  hint,
  clearedMessage = t("Cleared. Reload RichLyricEditor to start fresh."),
}) => {
  const [status, setStatus] = useState<ClearStatus>("idle");

  const advanceClearFlow = async () => {
    if (status !== "confirm") {
      setStatus("confirm");
      return;
    }
    setStatus("clearing");
    try {
      await clearRecoveryStorage();
      setStatus("cleared");
    } catch (err) {
      console.error(LOG_PREFIX, "clear failed", err);
      setStatus("failed");
    }
  };

  const label =
    status === "confirm"
      ? t("Confirm clear")
      : status === "clearing"
        ? t("Clearing…")
        : status === "cleared"
          ? t("Cleared")
          : t("Clear saved data");

  const message =
    status === "confirm"
      ? t("This wipes your autosave from this browser. Click again to confirm.")
      : status === "cleared"
        ? clearedMessage
        : status === "failed"
          ? t(
              "Couldn't clear the save. Try again or open RichLyricEditor's Export tab and use Clear.",
            )
          : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        hasIcon
        onClick={advanceClearFlow}
        disabled={status === "clearing" || status === "cleared"}
      >
        <IconTrash size={14} />
        {label}
      </Button>
      {hint && status === "idle" && (
        <p className="text-xs text-composer-text-muted text-center max-w-sm">
          {hint}
        </p>
      )}
      {message && (
        <p className="text-xs text-composer-text-muted select-text text-center max-w-sm">
          {message}
        </p>
      )}
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ClearRecoveryButton };
