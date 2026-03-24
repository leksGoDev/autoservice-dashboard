import type { MechanicsRange, MechanicRegistryItem, MechanicWorkloadItem } from "@/entities/mechanic/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

export const mechanicsRegistryFixture: MechanicRegistryItem[] = [
  {
    id: "mech_001",
    name: "Chris Nolan",
    specialization: "Diagnostics",
    activeJobs: 3,
    status: "busy",
    experienceYears: 9,
  },
  {
    id: "mech_002",
    name: "Sam Rivera",
    specialization: "Engine Repair",
    activeJobs: 2,
    status: "available",
    experienceYears: 7,
  },
  {
    id: "mech_003",
    name: "Jordan Kim",
    specialization: "Transmission",
    activeJobs: 4,
    status: "busy",
    experienceYears: 11,
  },
  {
    id: "mech_004",
    name: "Riley Adams",
    specialization: "Electrical",
    activeJobs: 1,
    status: "available",
    experienceYears: 5,
  },
  {
    id: "mech_005",
    name: "Taylor Brooks",
    specialization: "Brake Systems",
    activeJobs: 0,
    status: "off_shift",
    experienceYears: 6,
  },
  {
    id: "mech_006",
    name: "Morgan Lee",
    specialization: "Suspension",
    activeJobs: 2,
    status: "busy",
    experienceYears: 8,
  },
];

const mechanicsWorkloadByRange: Record<MechanicsRange, MechanicWorkloadItem[]> = {
  "7d": [
    { mechanicId: "mech_001", mechanicName: "Chris Nolan", assignedOrders: 4, utilization: 82 },
    { mechanicId: "mech_002", mechanicName: "Sam Rivera", assignedOrders: 3, utilization: 66 },
    { mechanicId: "mech_003", mechanicName: "Jordan Kim", assignedOrders: 5, utilization: 90 },
    { mechanicId: "mech_004", mechanicName: "Riley Adams", assignedOrders: 2, utilization: 44 },
    { mechanicId: "mech_005", mechanicName: "Taylor Brooks", assignedOrders: 1, utilization: 25 },
    { mechanicId: "mech_006", mechanicName: "Morgan Lee", assignedOrders: 3, utilization: 74 },
  ],
  "30d": [
    { mechanicId: "mech_001", mechanicName: "Chris Nolan", assignedOrders: 6, utilization: 84 },
    { mechanicId: "mech_002", mechanicName: "Sam Rivera", assignedOrders: 5, utilization: 72 },
    { mechanicId: "mech_003", mechanicName: "Jordan Kim", assignedOrders: 7, utilization: 92 },
    { mechanicId: "mech_004", mechanicName: "Riley Adams", assignedOrders: 4, utilization: 58 },
    { mechanicId: "mech_005", mechanicName: "Taylor Brooks", assignedOrders: 2, utilization: 38 },
    { mechanicId: "mech_006", mechanicName: "Morgan Lee", assignedOrders: 5, utilization: 76 },
  ],
  "90d": [
    { mechanicId: "mech_001", mechanicName: "Chris Nolan", assignedOrders: 8, utilization: 86 },
    { mechanicId: "mech_002", mechanicName: "Sam Rivera", assignedOrders: 7, utilization: 78 },
    { mechanicId: "mech_003", mechanicName: "Jordan Kim", assignedOrders: 9, utilization: 93 },
    { mechanicId: "mech_004", mechanicName: "Riley Adams", assignedOrders: 6, utilization: 64 },
    { mechanicId: "mech_005", mechanicName: "Taylor Brooks", assignedOrders: 4, utilization: 49 },
    { mechanicId: "mech_006", mechanicName: "Morgan Lee", assignedOrders: 7, utilization: 81 },
  ],
};

export function getMechanicsWorkloadFixtureByRange(range: MechanicsRange = DEFAULT_DASHBOARD_RANGE) {
  return mechanicsWorkloadByRange[range];
}
