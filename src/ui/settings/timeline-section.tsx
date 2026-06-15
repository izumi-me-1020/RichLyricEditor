import { useSettingsStore } from "@/stores/settings";
import { SliderSetting, ToggleSetting } from "@/ui/settings/setting-controls";
import { useTimelineStore } from "@/views/timeline/timeline-store";
import { t } from "i18next";

// -- Timeline Section ---------------------------------------------------------

const TimelineSection: React.FC = () => {
  const set = useSettingsStore((s) => s.set);

  return (
    <div className="divide-y divide-composer-border">
      <SliderSetting
        label={t("Default zoom")}
        description={t("Initial zoom level (px/sec) when opening the timeline.")}
        settingKey="defaultZoom"
        min={20}
        max={500}
        step={20}
        format={(v) => `${v} px/s`}
        action={{
          label: t("Use current"),
          onClick: () => set("defaultZoom", useTimelineStore.getState().zoom),
        }}
      />
      <SliderSetting
        label={t("Default row height")}
        description={t("Starting height of each lyric row in the timeline.")}
        settingKey="defaultRowHeight"
        min={32}
        max={120}
        step={4}
        format={(v) => `${v}px`}
        action={{
          label: t("Use current"),
          onClick: () => set("defaultRowHeight", useTimelineStore.getState().defaultRowHeight),
        }}
      />
      <ToggleSetting
        label={t("Snap (magnet)")}
        description={t("Word edges snap to nearby anchors when dragging or resizing.")}
        settingKey="timelineSnap"
      />
      <SliderSetting
        label={t("Snap threshold")}
        description={t("Distance (in pixels) at which the moving block locks onto an anchor.")}
        settingKey="timelineSnapThreshold"
        min={4}
        max={24}
        step={1}
        format={(v) => `${v}px`}
      />
      <ToggleSetting
        label={t("Follow playhead")}
        description={t("Auto-scroll the timeline to keep the playhead visible.")}
        settingKey="followPlayhead"
      />
      <ToggleSetting
        label={t("Default rolling edit mode")}
        description={t("Start in rolling edit mode when opening a project.")}
        settingKey="defaultRollingEdit"
      />
      <ToggleSetting
        label={t("Default preview sidebar")}
        description={t("Open the preview sidebar by default.")}
        settingKey="defaultPreviewSidebar"
      />
      <ToggleSetting
        label={t("Scroll wheel scrolls timeline")}
        description={t("Plain scroll moves the timeline horizontally. Hold Shift to scroll vertically.")}
        settingKey="timelineHorizontalScroll"
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { TimelineSection };
