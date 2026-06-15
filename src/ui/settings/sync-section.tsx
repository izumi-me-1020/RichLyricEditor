import { SelectSetting, SliderSetting } from "@/ui/settings/setting-controls";
import { SplitCharacterSetting } from "@/ui/settings/split-character-setting";
import { t } from "i18next";

// -- Sync Section -------------------------------------------------------------

const SyncSection: React.FC = () => (
  <div className="divide-y divide-composer-border">
    <SplitCharacterSetting />
    <SliderSetting
      label={t("Nudge amount")}
      description={t("How far timing shifts when using nudge controls.")}
      settingKey="nudgeAmount"
      min={0.01}
      max={0.2}
      step={0.01}
      format={(v) => `${(v * 1000).toFixed(0)}ms`}
    />
    <SliderSetting
      label={t("Default word duration")}
      description={t("Length assigned to newly created words in the timeline.")}
      settingKey="defaultWordDuration"
      min={0.1}
      max={1}
      step={0.05}
      format={(v) => `${(v * 1000).toFixed(0)}ms`}
    />
    <SliderSetting
      label={t("Min word duration")}
      description={t("Shortest allowed duration for a word.")}
      settingKey="minWordDuration"
      min={0.01}
      max={0.2}
      step={0.01}
      format={(v) => `${(v * 1000).toFixed(0)}ms`}
    />
    <SelectSetting
      label={t("Default granularity")}
      description={t("Whether new projects start in word or line timing mode.")}
      settingKey="defaultGranularity"
      options={[
        { value: "word", label: t("Word") },
        { value: "line", label: t("Line") },
      ]}
    />
  </div>
);

// -- Exports ------------------------------------------------------------------

export { SyncSection };
