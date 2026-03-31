import type { WorkBoardColumn, WorkBoardQuickAction, WorkBoardStatus } from "@/entities/work-board/model/types";
import { useUpdateOrderStatusMutation } from "@/features/order-operations/api/mutations";
import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getPriorityBadgeClass, getStatusBadgeClass } from "@/shared/ui/status-badges";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  formatWorkBoardCurrency,
  formatWorkBoardUpdatedAt,
  getQuickActionTone,
  getWorkBoardStatusModifier,
} from "./model/presentation";
import styles from "./WorkBoardColumns.module.css";

type WorkBoardColumnsProps = {
  columns: WorkBoardColumn[];
};

function getQuickActionClass(action: WorkBoardQuickAction) {
  const tone = getQuickActionTone(action);

  if (tone === "warning") {
    return styles.quickActionWarning;
  }

  if (tone === "success") {
    return styles.quickActionSuccess;
  }

  return styles.quickActionNeutral;
}

const QUICK_ACTION_STATUS_MAP: Record<WorkBoardQuickAction, WorkBoardStatus> = {
  start_work: "in_progress",
  wait_parts: "waiting_parts",
  complete: "completed",
  reschedule: "scheduled",
};

export const WorkBoardColumns = ({ columns }: WorkBoardColumnsProps) => {
  const { t } = useI18n();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();
  const [errorByOrderId, setErrorByOrderId] = useState<Record<string, string>>({});

  const handleQuickAction = async (orderId: string, action: WorkBoardQuickAction) => {
    setErrorByOrderId((previous) => {
      const next = { ...previous };
      delete next[orderId];
      return next;
    });
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: QUICK_ACTION_STATUS_MAP[action],
      });
    } catch (error) {
      const errorMessage = getMutationErrorMessage(error, t("pages.workBoard.quickActions.errorFallback") as string);

      setErrorByOrderId((previous) => ({
        ...previous,
        [orderId]: errorMessage,
      }));
    }
  };

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
                  <article key={card.id} className={styles.card} data-board-card={card.id} data-order-id={card.orderId}>
                    <header className={styles.cardHeader}>
                      <div>
                        <h3 className={styles.orderNumber}>
                          <Link
                            to={`/orders/${card.orderId}`}
                            className="inline-flex rounded px-1 py-0.5 text-inherit underline decoration-transparent underline-offset-2 transition-colors hover:text-[#9ac0ff] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
                          >
                            {card.orderNumber}
                          </Link>
                        </h3>
                        <p className={styles.customerName}>{card.customerName}</p>
                      </div>

                      <div className="grid justify-items-end gap-1.5">
                        <span
                          className={[
                            "rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold",
                            getStatusBadgeClass(getWorkBoardStatusModifier(card.status)),
                          ]
                            .join(" ")
                            .trim()}
                        >
                          {t(`order.status.${card.status}`)}
                        </span>
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em]",
                            getPriorityBadgeClass(card.priority),
                          ]
                            .join(" ")
                            .trim()}
                        >
                          {t(`order.priority.${card.priority}`)}
                        </span>
                      </div>
                    </header>

                    <p className={styles.vehicleLabel}>{card.vehicleLabel}</p>

                    <div className={styles.metaRow}>
                      <span>{t("pages.workBoard.card.mechanic", { name: card.assignedMechanic })}</span>
                      <span>{t("pages.workBoard.card.jobs", { count: card.jobsCount })}</span>
                    </div>

                    <div className={styles.metaRow}>
                      <span>{formatWorkBoardCurrency(card.totalAmount)}</span>
                      <span>{t("pages.workBoard.card.updated", { time: formatWorkBoardUpdatedAt(card.updatedAt) })}</span>
                    </div>

                    <p className={styles.contextText}>{card.shortContext}</p>

                    <div className={styles.quickActions}>
                      {card.availableActions.map((action) => {
                        return (
                          <button
                            key={`${card.id}-${action}`}
                            type="button"
                            className={[styles.quickActionButton, getQuickActionClass(action)].join(" ").trim()}
                            onClick={() => {
                              void handleQuickAction(card.orderId, action);
                            }}
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            {t(`pages.workBoard.quickActions.${action}`)}
                          </button>
                        );
                      })}
                    </div>
                    {errorByOrderId[card.orderId] ? (
                      <p role="alert" className={styles.quickActionError}>
                        {errorByOrderId[card.orderId]}
                      </p>
                    ) : null}
                  </article>
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
