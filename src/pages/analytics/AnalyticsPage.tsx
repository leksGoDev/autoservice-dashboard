import { useI18n } from "@/shared/i18n/use-i18n";
import { PagePlaceholder } from "@/shared/ui/PagePlaceholder";
import { PlaceholderCard } from "@/shared/ui/PlaceholderCard";

export function AnalyticsPage() {
  const { t } = useI18n();

  return (
    <PagePlaceholder
      eyebrow={t("pages.analytics.eyebrow")}
      title={t("pages.analytics.title")}
      description={t("pages.analytics.description")}
    >
      <PlaceholderCard title={t("pages.analytics.cards.chartTitle")} text={t("pages.analytics.cards.chartText")} />
      <PlaceholderCard
        title={t("pages.analytics.cards.filtersTitle")}
        text={t("pages.analytics.cards.filtersText")}
      />
      <PlaceholderCard title={t("pages.analytics.cards.dataTitle")} text={t("pages.analytics.cards.dataText")} />
    </PagePlaceholder>
  );
}
