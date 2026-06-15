import { useConfirm } from "@/stores/confirm-store";
import { useSettingsStore } from "@/stores/settings";
import { Button } from "@/ui/button";
import { SelectSetting, ToggleSetting } from "@/ui/settings/setting-controls";
import { IconRefresh, IconRoute } from "@tabler/icons-react";
import { t } from "i18next";

// -- General Section ----------------------------------------------------------

const GeneralSection: React.FC<{
  onResetTour: () => void;
  onClose: () => void;
}> = ({ onResetTour, onClose }) => {
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults);
  const confirm = useConfirm();

  const handleResetSettings = async () => {
    const ok = await confirm({
      title: t("Reset all settings?"),
      description: t(
        "Restore every setting to its default value. Your project data is not affected.",
      ),
      confirmLabel: t("Reset"),
      variant: "destructive",
      settingsKey: "confirmResetSettings",
    });
    if (ok) resetToDefaults();
  };

  return (
    <div className="divide-y divide-composer-border">
      <ToggleSetting
        label={t("Show shortcut hints")}
        description={t("Display keyboard shortcut badges on toolbar buttons.")}
        settingKey="showShortcutHints"
      />
      <ToggleSetting
        label={t("Show syllable indicators")}
        description={t("Visually group syllables split from one word.")}
        settingKey="showSyllableIndicators"
      />
      <ToggleSetting
        label={t("Auto-extract background vocals")}
        description={t(
          "Move parenthesised text into background vocals when lyrics are pasted, imported, or edited.",
        )}
        settingKey="autoExtractBackgroundVocals"
      />
      <ToggleSetting
        label={t("Merge standalone background lines")}
        description={t(
          "When a whole line is in parentheses, attach it to the line above instead of keeping it as its own line.",
        )}
        settingKey="mergeStandaloneBackgroundLines"
      />
      <ToggleSetting
        label={t("Preserve brackets when extracting")}
        description={t(
          "Keep parentheses around extracted background vocals. Multiple snippets share one outer pair.",
        )}
        settingKey="preserveBracketsOnExtraction"
      />
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-composer-text">
            {t("Reset product tour")}
          </span>
          <span className="text-xs text-composer-text-muted">
            {t(
              "Restart the guided walkthrough that introduces RichLyricEditor's features.",
            )}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          hasIcon
          onClick={() => {
            onResetTour();
            onClose();
          }}
        >
          <IconRoute size={14} />
          {t("Reset tour")}
        </Button>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-composer-text">
            {t("Reset to defaults")}
          </span>
          <span className="text-xs text-composer-text-muted">
            {t("Restore all settings to their original values.")}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          hasIcon
          onClick={handleResetSettings}
        >
          <IconRefresh size={14} />
          {t("Reset all")}
        </Button>
      </div>
      <SelectSetting
        label={t("Language")}
        description={t("Choose the application language.")}
        settingKey="language"
        options={[
          { value: "ja", label: t("Japanese") },
          { value: "en", label: t("English") },
        ]}
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { GeneralSection };
