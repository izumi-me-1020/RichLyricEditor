import { ToggleSetting } from "@/ui/settings/setting-controls";
import { t } from "i18next";

// -- Confirmations Section ----------------------------------------------------

const ConfirmationsSection: React.FC = () => {
  return (
    <div className="py-3">
      <div className="flex flex-col gap-0.5 mb-3">
        <span className="text-sm font-medium text-composer-text">{t("Confirmation prompts")}</span>
        <span className="text-xs text-composer-text-muted">
          {t(
            "Toggle confirmation prompts for actions that can lose work. Turn one off to skip its warning until you re-enable it here.",
          )}
        </span>
      </div>
      <div className="divide-y divide-composer-border">
        <ToggleSetting
          label={t("Confirm replacing project from URL")}
          description={t("Show a warning when an import URL would replace your current project.")}
          settingKey="confirmReplaceProjectFromHash"
        />
        <ToggleSetting
          label={t("Confirm replacing lyrics on import")}
          description={t("Show a warning when importing lyrics into a project that already has lines.")}
          settingKey="confirmReplaceLyrics"
        />
        <ToggleSetting
          label={t("Confirm resetting sync timing")}
          description={t("Show a warning before clearing every word and line timing in the sync view.")}
          settingKey="confirmSyncReset"
        />
        <ToggleSetting
          label={t("Confirm clearing project")}
          description={t("Show a warning before discarding the current project, metadata, and audio file.")}
          settingKey="confirmClearProject"
        />
        <ToggleSetting
          label={t("Confirm resetting all settings")}
          description={t("Show a warning before restoring all settings to their defaults.")}
          settingKey="confirmResetSettings"
        />
        <ToggleSetting
          label={t("Confirm resetting all shortcuts")}
          description={t("Show a warning before clearing all custom keyboard bindings.")}
          settingKey="confirmResetShortcuts"
        />
        <ToggleSetting
          label={t("Confirm before splitting multiple identical words")}
          description={t(
            "Show a warning when a syllable split would also apply to other identical words across the project.",
          )}
          settingKey="confirmApplyToAllSyllableSplit"
        />
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ConfirmationsSection };
