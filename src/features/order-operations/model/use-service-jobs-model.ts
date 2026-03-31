import { useCallback, useEffect, useMemo, useState } from "react";

import type { OrderServiceJob, ServiceJobStatus } from "@/entities/order/model/types";
import {
  useAddServiceJobMutation,
  useAssignServiceJobMechanicMutation,
  useUpdateServiceJobStatusMutation,
} from "@/features/order-operations/api/mutations";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getMutationErrorMessage } from "./get-mutation-error-message";

type JobsSuccessKey = "jobAdded" | "jobStatusUpdated" | "jobMechanicAssigned";

type UseServiceJobsControlsModelParams = {
  orderId: string;
  jobs: OrderServiceJob[];
  mechanics: string[];
};

export const useServiceJobsControlsModel = ({
  orderId,
  jobs,
  mechanics,
}: UseServiceJobsControlsModelParams) => {
  const { t } = useI18n();

  const [jobName, setJobName] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobEstimatedHours, setJobEstimatedHours] = useState("1.0");
  const [jobLaborPrice, setJobLaborPrice] = useState("120");
  const [jobMechanic, setJobMechanic] = useState("");

  const [jobStatuses, setJobStatuses] = useState<Record<string, ServiceJobStatus>>({});
  const [jobMechanics, setJobMechanics] = useState<Record<string, string>>({});
  const [lastSuccessKey, setLastSuccessKey] = useState<JobsSuccessKey | null>(null);

  const addJobMutation = useAddServiceJobMutation();
  const updateJobStatusMutation = useUpdateServiceJobStatusMutation();
  const assignJobMechanicMutation = useAssignServiceJobMechanicMutation();

  useEffect(() => {
    const statuses: Record<string, ServiceJobStatus> = {};
    const assignedMechanics: Record<string, string> = {};

    jobs.forEach((job) => {
      statuses[job.id] = job.status;
      assignedMechanics[job.id] = job.assignedMechanic;
    });

    setJobStatuses((prev) => {
      if (Object.keys(prev).length === Object.keys(statuses).length) {
        const isSame = Object.entries(statuses).every(([key, value]) => prev[key] === value);

        if (isSame) {
          return prev;
        }
      }

      return statuses;
    });

    setJobMechanics((prev) => {
      if (Object.keys(prev).length === Object.keys(assignedMechanics).length) {
        const isSame = Object.entries(assignedMechanics).every(([key, value]) => prev[key] === value);

        if (isSame) {
          return prev;
        }
      }

      return assignedMechanics;
    });
  }, [jobs]);

  useEffect(() => {
    if (jobs.length === 0) {
      return;
    }

    setJobMechanic((prev) => (prev.trim().length > 0 ? prev : jobs[0].assignedMechanic));
  }, [jobs]);

  const availableMechanics = useMemo(() => {
    const normalized = new Set(mechanics.filter((item) => item.trim().length > 0));

    jobs.forEach((job) => {
      if (job.assignedMechanic.trim().length > 0) {
        normalized.add(job.assignedMechanic);
      }
    });

    return [...normalized].sort((left, right) => left.localeCompare(right));
  }, [jobs, mechanics]);

  const resetFeedback = useCallback(() => {
    setLastSuccessKey(null);
    addJobMutation.reset();
    updateJobStatusMutation.reset();
    assignJobMechanicMutation.reset();
  }, [addJobMutation, assignJobMechanicMutation, updateJobStatusMutation]);

  const handleAddJob = useCallback(async () => {
    resetFeedback();

    const estimatedHours = Number(jobEstimatedHours);
    const laborPrice = Number(jobLaborPrice);
    const name = jobName.trim();
    const category = jobCategory.trim();
    const assignedMechanic = jobMechanic.trim();

    if (!name || !category || !Number.isFinite(estimatedHours) || estimatedHours <= 0 || !Number.isFinite(laborPrice) || laborPrice <= 0) {
      return;
    }

    try {
      await addJobMutation.mutateAsync({
        orderId,
        payload: {
          name,
          category,
          estimatedHours,
          laborPrice,
          assignedMechanic: assignedMechanic || undefined,
        },
      });

      setLastSuccessKey("jobAdded");
      setJobName("");
      setJobCategory("");
      setJobEstimatedHours("1.0");
      setJobLaborPrice("120");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  }, [addJobMutation, jobCategory, jobEstimatedHours, jobLaborPrice, jobMechanic, jobName, orderId, resetFeedback]);

  const handleUpdateJobStatus = useCallback(async (jobId: string, status: ServiceJobStatus) => {
    resetFeedback();

    try {
      await updateJobStatusMutation.mutateAsync({
        orderId,
        jobId,
        status,
      });
      setLastSuccessKey("jobStatusUpdated");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  }, [orderId, resetFeedback, updateJobStatusMutation]);

  const handleAssignJobMechanic = useCallback(async (jobId: string, assignedMechanic: string) => {
    const nextMechanic = assignedMechanic.trim();

    if (!nextMechanic) {
      return;
    }

    resetFeedback();

    try {
      await assignJobMechanicMutation.mutateAsync({
        orderId,
        jobId,
        assignedMechanic: nextMechanic,
      });
      setLastSuccessKey("jobMechanicAssigned");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  }, [assignJobMechanicMutation, orderId, resetFeedback]);

  const isBusy = addJobMutation.isPending || updateJobStatusMutation.isPending || assignJobMechanicMutation.isPending;
  const canAddJob =
    jobName.trim().length > 0 &&
    jobCategory.trim().length > 0 &&
    Number.isFinite(Number(jobEstimatedHours)) &&
    Number(jobEstimatedHours) > 0 &&
    Number.isFinite(Number(jobLaborPrice)) &&
    Number(jobLaborPrice) > 0;
  const currentError = addJobMutation.error ?? updateJobStatusMutation.error ?? assignJobMechanicMutation.error;
  const errorMessage = currentError
    ? getMutationErrorMessage(currentError, t("pages.orderDetails.controls.errors.jobsFallback") as string)
    : null;

  const successMessage =
    lastSuccessKey === "jobAdded"
      ? t("pages.orderDetails.controls.success.jobAdded")
      : lastSuccessKey === "jobStatusUpdated"
        ? t("pages.orderDetails.controls.success.jobStatusUpdated")
        : lastSuccessKey === "jobMechanicAssigned"
          ? t("pages.orderDetails.controls.success.jobMechanicAssigned")
          : null;

  return {
    jobName,
    setJobName,
    jobCategory,
    setJobCategory,
    jobEstimatedHours,
    setJobEstimatedHours,
    jobLaborPrice,
    setJobLaborPrice,
    jobMechanic,
    setJobMechanic,
    jobStatuses,
    setJobStatuses,
    jobMechanics,
    setJobMechanics,
    availableMechanics,
    isBusy,
    canAddJob,
    addJobMutation,
    updateJobStatusMutation,
    assignJobMechanicMutation,
    handleAddJob,
    handleUpdateJobStatus,
    handleAssignJobMechanic,
    errorMessage,
    successMessage,
  };
};

export type ServiceJobsControlsModel = ReturnType<typeof useServiceJobsControlsModel>;
