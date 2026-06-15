import { SliderSetting } from "@/ui/settings/setting-controls";
import { t } from "i18next";

// -- Storage Section ----------------------------------------------------------

const StorageSection: React.FC = () => (
  <div className="divide-y divide-composer-border">
    <SliderSetting
      label={t("Auto-save delay")}
      description={t("How long to wait after your last edit before auto-saving.")}
      settingKey="autoSaveDelay"
      min={500}
      max={10000}
      step={500}
      format={(v) => `${(v / 1000).toFixed(1)}s`}
    />
  </div>
);

// -- Exports ------------------------------------------------------------------

export { StorageSection };
