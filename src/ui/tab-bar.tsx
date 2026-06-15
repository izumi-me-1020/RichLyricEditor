import { useProjectStore } from "@/stores/project";
import type { SimpleTab } from "@/stores/project";
import { useSettingsStore } from "@/stores/settings";
import { InlineKeyBadge } from "@/ui/inline-key-badge";
import { t } from "i18next";

const TabBar: React.FC = () => {
  const activeTab = useProjectStore((s) => s.activeTab);
  const setActiveTab = useProjectStore((s) => s.setActiveTab);
  const showHints = useSettingsStore((s) => s.showShortcutHints);
  const TABS: { id: SimpleTab; label: string }[] = [
    { id: "import", label: t("Import") },
    { id: "edit", label: t("Edit") },
    { id: "sync", label: t("Sync") },
    { id: "timeline", label: t("Timeline") },
    { id: "preview", label: t("Preview") },
    { id: "export", label: t("Export") },
  ];
  return (
    <nav
      data-tour="tab-bar"
      className="flex border-b border-composer-border select-none"
    >
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            data-tour={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-composer-accent text-composer-text"
                : "text-composer-text-muted hover:text-composer-text-secondary"
            }`}
          >
            {tab.label}
            {showHints && <InlineKeyBadge keys={["Mod", String(index + 1)]} />}
          </button>
        );
      })}
    </nav>
  );
};

export { TabBar };
