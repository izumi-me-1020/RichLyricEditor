import { useConfirmStore } from "@/stores/confirm-store";
import { useProjectStore } from "@/stores/project";
import { showGroupActionToast } from "@/utils/group-toast";
import { t } from "i18next";

// -- Types --------------------------------------------------------------------

interface DeleteGroupConfirmArgs {
  groupId: string;
  groupLabel: string;
  instanceCount: number;
}

// -- Operation -----------------------------------------------------------------

async function deleteGroupWithConfirm({
  groupId,
  groupLabel,
  instanceCount,
}: DeleteGroupConfirmArgs): Promise<void> {
  const ok = await useConfirmStore.getState().open({
    title: t('Delete the "{{groupLabel}}" group?', {
      groupLabel,
    }),

    description: t(
      "All {{instanceCount}} instances will become standalone lines. They keep their text and timing, but stop updating together.",
      {
        instanceCount,
      },
    ),

    confirmLabel: t("Delete group"),
    variant: "destructive",
    settingsKey: "confirmGroupDissolution",
    recoverable: true,
  });
  if (!ok) return;
  useProjectStore.getState().removeGroup(groupId);
  showGroupActionToast("Group deleted");
}

// -- Exports -------------------------------------------------------------------

export { deleteGroupWithConfirm };
