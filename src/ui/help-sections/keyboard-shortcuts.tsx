import { useTranslation } from "react-i18next";
import { ShortcutSection, getShortcutSections } from "@/ui/shortcut-reference";

const KeyboardShortcutsSection: React.FC = () => {
  useTranslation();

  const sections = getShortcutSections();

  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
      {sections.map((section) => (
        <ShortcutSection key={section.title} {...section} />
      ))}
    </div>
  );
};

export { KeyboardShortcutsSection };
