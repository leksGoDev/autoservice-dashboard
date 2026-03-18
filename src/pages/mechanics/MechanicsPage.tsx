import { useI18n } from "@/shared/i18n/use-i18n";
import { PagePlaceholder } from "@/shared/ui/PagePlaceholder";
import { PlaceholderCard } from "@/shared/ui/PlaceholderCard";

export function MechanicsPage() {
  const { t } = useI18n();

  return (
    <PagePlaceholder
      eyebrow={t("pages.mechanics.eyebrow")}
      title={t("pages.mechanics.title")}
      description={t("pages.mechanics.description")}
    >
      <PlaceholderCard title={t("pages.mechanics.cards.registryTitle")} text={t("pages.mechanics.cards.registryText")} />
      <PlaceholderCard
        title={t("pages.mechanics.cards.availabilityTitle")}
        text={t("pages.mechanics.cards.availabilityText")}
      />
      <PlaceholderCard
        title={t("pages.mechanics.cards.assignmentsTitle")}
        text={t("pages.mechanics.cards.assignmentsText")}
      />
    </PagePlaceholder>
  );
}
