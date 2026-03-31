import type { WorkBoardColumn } from "@/entities/work-board/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useWorkBoardQuickActions } from "./hooks/use-work-board-quick-actions";
import { WorkBoardCard } from "./ui/WorkBoardCard";
import styles from "./WorkBoardColumns.module.css";

type WorkBoardColumnsProps = {
  columns: WorkBoardColumn[];
};

export const WorkBoardColumns = ({ columns }: WorkBoardColumnsProps) => {
  const { t } = useI18n();
  const { errorByOrderId, isMutating, isPendingAction, isOrderPending, handleQuickAction } =
    useWorkBoardQuickActions();

  return (
    <section className={styles.boardScroller} aria-label={t("pages.workBoard.boardAria")}>
      <div className={styles.boardGrid}>
        {columns.map((column) => (
          <section key={column.status} className={styles.column} data-board-column={column.status}>
            <header className={styles.columnHeader}>
              <h2 className={styles.columnTitle}>{t(`order.status.${column.status}`)}</h2>
              <span className={styles.columnCount}>{column.cards.length}</span>
            </header>

            {column.cards.length > 0 ? (
              <div className={styles.columnCards}>
                {column.cards.map((card) => (
                  <WorkBoardCard
                    key={card.id}
                    card={card}
                    isMutating={isMutating}
                    isPendingAction={isPendingAction}
                    isOrderPending={isOrderPending}
                    onQuickAction={(orderId, action) => {
                      void handleQuickAction(orderId, action);
                    }}
                    errorMessage={errorByOrderId[card.orderId]}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyColumn}>{t("pages.workBoard.emptyColumn")}</div>
            )}
          </section>
        ))}
      </div>
    </section>
  );
};
