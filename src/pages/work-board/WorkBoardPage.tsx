import { useI18n } from "@/shared/i18n/use-i18n";
import { PagePlaceholder } from "@/shared/ui/PagePlaceholder";
import { PlaceholderCard } from "@/shared/ui/PlaceholderCard";

export const WorkBoardPage = () => {
  const { t } = useI18n();

  return (
    <PagePlaceholder
      eyebrow={t("pages.workBoard.eyebrow")}
      title={t("pages.workBoard.title")}
      description={t("pages.workBoard.description")}
    >
      <PlaceholderCard title={t("pages.workBoard.cards.columnsTitle")} text={t("pages.workBoard.cards.columnsText")} />
      <PlaceholderCard title={t("pages.workBoard.cards.cardsTitle")} text={t("pages.workBoard.cards.cardsText")} />
      <PlaceholderCard
        title={t("pages.workBoard.cards.interactionsTitle")}
        text={t("pages.workBoard.cards.interactionsText")}
      />
    </PagePlaceholder>
  );
};
