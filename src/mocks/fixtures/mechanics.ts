import type { MechanicsRange, MechanicRegistryItem, MechanicWorkloadItem } from "@/entities/mechanic/model/types";
import { getOrdersMockState } from "@/mocks/state/orders";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

type MechanicProfileFixtureItem = {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  defaultStatus: MechanicRegistryItem["status"];
};

export const mechanicProfilesFixture: MechanicProfileFixtureItem[] = [
  {
    id: "mech_001",
    name: "Artem Bondar",
    specialization: "Diagnostics",
    experienceYears: 9,
    defaultStatus: "available",
  },
  {
    id: "mech_002",
    name: "Nikita Isaev",
    specialization: "Engine Repair",
    experienceYears: 7,
    defaultStatus: "available",
  },
  {
    id: "mech_003",
    name: "Damir Karimov",
    specialization: "Transmission",
    experienceYears: 11,
    defaultStatus: "available",
  },
  {
    id: "mech_004",
    name: "Ilya Melnik",
    specialization: "Electrical",
    experienceYears: 5,
    defaultStatus: "available",
  },
  {
    id: "mech_005",
    name: "Timur Sadykov",
    specialization: "Brake Systems",
    experienceYears: 6,
    defaultStatus: "off_shift",
  },
  {
    id: "mech_006",
    name: "Ruslan Aliev",
    specialization: "Suspension",
    experienceYears: 8,
    defaultStatus: "available",
  },
];

export const mechanicNamesFixture = mechanicProfilesFixture.map((item) => item.name) as readonly string[];

const RANGE_DAYS: Record<MechanicsRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function getAnchorTimestamp() {
  const orders = getOrdersMockState();
  const timestamps = orders.flatMap((order) => [order.createdAt, order.updatedAt]).map((value) => new Date(value).getTime());
  return timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
}

function isInsideRange(isoDate: string, range: MechanicsRange) {
  const timestamp = new Date(isoDate).getTime();
  const anchorTimestamp = getAnchorTimestamp();
  const minTimestamp = anchorTimestamp - (RANGE_DAYS[range] - 1) * 24 * 60 * 60 * 1000;
  return timestamp >= minTimestamp && timestamp <= anchorTimestamp;
}

function getActiveJobsCountByMechanic() {
  return getOrdersMockState().reduce<Record<string, number>>((accumulator, order) => {
    order.jobs.forEach((job) => {
      if (job.status !== "completed") {
        accumulator[job.assignedMechanic] = (accumulator[job.assignedMechanic] ?? 0) + 1;
      }
    });

    return accumulator;
  }, {});
}

function getDerivedStatus(activeJobs: number, defaultStatus: MechanicRegistryItem["status"]): MechanicRegistryItem["status"] {
  if (activeJobs >= 3) {
    return "busy";
  }

  if (activeJobs === 0) {
    return defaultStatus;
  }

  return "available";
}

export function getMechanicsRegistryFixture(): MechanicRegistryItem[] {
  const activeJobsByMechanic = getActiveJobsCountByMechanic();

  return mechanicProfilesFixture.map((profile) => {
    const activeJobs = activeJobsByMechanic[profile.name] ?? 0;

    return {
      id: profile.id,
      name: profile.name,
      specialization: profile.specialization,
      activeJobs,
      status: getDerivedStatus(activeJobs, profile.defaultStatus),
      experienceYears: profile.experienceYears,
    };
  });
}

export function getMechanicsWorkloadFixtureByRange(range: MechanicsRange = DEFAULT_DASHBOARD_RANGE) {
  const registry = getMechanicsRegistryFixture();
  const assignedOrdersByMechanic = getOrdersMockState().reduce<Record<string, number>>((accumulator, order) => {
    if (order.status === "cancelled" || !isInsideRange(order.updatedAt, range)) {
      return accumulator;
    }

    accumulator[order.assignedMechanic] = (accumulator[order.assignedMechanic] ?? 0) + 1;
    return accumulator;
  }, {});

  const maxAssignedOrders = Math.max(
    1,
    ...registry.map((item) => assignedOrdersByMechanic[item.name] ?? 0),
  );

  return registry.map<MechanicWorkloadItem>((item) => {
    const assignedOrders = assignedOrdersByMechanic[item.name] ?? 0;
    const activeJobs = item.activeJobs;
    const utilization = assignedOrders === 0 && activeJobs === 0
      ? 0
      : Math.min(98, Math.round((assignedOrders / maxAssignedOrders) * 70 + activeJobs * 8));

    return {
      mechanicId: item.id,
      mechanicName: item.name,
      assignedOrders,
      utilization,
    };
  });
}
