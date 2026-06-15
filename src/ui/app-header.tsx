import { Button } from "@/ui/button";
import { IconHelp, IconRoute, IconSettings } from "@tabler/icons-react";
import { t } from "i18next";

interface AppHeaderProps {
  onSettingsOpen: () => void;
  onHelpOpen: () => void;
  onTourStart: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onSettingsOpen,
  onHelpOpen,
  onTourStart,
}) => (
  <header className="flex items-center justify-between p-4 border-b select-none border-composer-border">
    <h1 className="text-xl font-semibold">
      <img
        src="/logo.svg"
        alt={t("RichLyricEditor Logo")}
        className="inline-block size-6 mr-2 -mt-1"
      />
      RichLyricEditor
    </h1>
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={onSettingsOpen}
        title={t("Settings")}
      >
        <IconSettings className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onTourStart}
        title={t("Product tour")}
      >
        <IconRoute className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onHelpOpen}
        title={t("Keyboard shortcuts (?)")}
      >
        <IconHelp className="size-5" />
      </Button>
    </div>
  </header>
);

export { AppHeader };
