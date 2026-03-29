import type { AppointmentStatus } from "@/entities/appointment/model/types";
import { orderMechanicsFixture } from "@/mocks/fixtures/orders";

type AppointmentFixtureItem = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  serviceLabel: string;
  notes: string;
  estimatedDurationMin: number;
  contactPhone: string;
  assignedMechanic: string;
  status: AppointmentStatus;
  scheduledFor: string;
  createdAt: string;
};

function atOffset(daysFromToday: number, hours: number, minutes: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function createdBefore(scheduleIso: string, daysBefore: number) {
  const date = new Date(scheduleIso);
  date.setDate(date.getDate() - daysBefore);
  return date.toISOString();
}

export const appointmentsFixture: AppointmentFixtureItem[] = [
  {
    id: "apt_001",
    number: "APT-2001",
    customerId: "cust_001",
    customerName: "Alex Turner",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    serviceLabel: "Brake diagnostics",
    notes: "Intermittent vibration while braking above 70 km/h.",
    estimatedDurationMin: 90,
    contactPhone: "+1 555-0101",
    assignedMechanic: orderMechanicsFixture[0],
    status: "pending",
    scheduledFor: atOffset(0, 10, 30),
    createdAt: createdBefore(atOffset(0, 10, 30), 2),
  },
  {
    id: "apt_002",
    number: "APT-2002",
    customerId: "cust_002",
    customerName: "Morgan Lee",
    vehicleId: "veh_002",
    vehicleLabel: "2018 Nissan Altima",
    serviceLabel: "Engine warning check",
    notes: "Check engine light returned after last service.",
    estimatedDurationMin: 70,
    contactPhone: "+1 555-0102",
    assignedMechanic: orderMechanicsFixture[1],
    status: "confirmed",
    scheduledFor: atOffset(0, 8, 0),
    createdAt: createdBefore(atOffset(0, 8, 0), 1),
  },
  {
    id: "apt_003",
    number: "APT-2003",
    customerId: "cust_003",
    customerName: "Jamie Carter",
    vehicleId: "veh_003",
    vehicleLabel: "2020 Ford F-150",
    serviceLabel: "Suspension noise inspection",
    notes: "Noise appears on rough roads.",
    estimatedDurationMin: 80,
    contactPhone: "+1 555-0103",
    assignedMechanic: orderMechanicsFixture[2],
    status: "pending",
    scheduledFor: atOffset(1, 12, 15),
    createdAt: createdBefore(atOffset(1, 12, 15), 3),
  },
  {
    id: "apt_004",
    number: "APT-2004",
    customerId: "cust_004",
    customerName: "Taylor Brooks",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    serviceLabel: "A/C system diagnostics",
    notes: "Weak cooling after startup.",
    estimatedDurationMin: 60,
    contactPhone: "+1 555-0104",
    assignedMechanic: orderMechanicsFixture[3],
    status: "confirmed",
    scheduledFor: atOffset(2, 15, 45),
    createdAt: createdBefore(atOffset(2, 15, 45), 1),
  },
  {
    id: "apt_005",
    number: "APT-2005",
    customerId: "cust_005",
    customerName: "Drew Wilson",
    vehicleId: "veh_005",
    vehicleLabel: "2022 Tesla Model S",
    serviceLabel: "Battery thermal check",
    notes: "Customer noticed reduced charging speed.",
    estimatedDurationMin: 95,
    contactPhone: "+1 555-0105",
    assignedMechanic: orderMechanicsFixture[0],
    status: "confirmed",
    scheduledFor: atOffset(-1, 16, 20),
    createdAt: createdBefore(atOffset(-1, 16, 20), 4),
  },
  {
    id: "apt_006",
    number: "APT-2006",
    customerId: "cust_002",
    customerName: "Morgan Lee",
    vehicleId: "veh_002",
    vehicleLabel: "2018 Nissan Altima",
    serviceLabel: "Oil and filter maintenance",
    notes: "Regular maintenance interval.",
    estimatedDurationMin: 45,
    contactPhone: "+1 555-0102",
    assignedMechanic: orderMechanicsFixture[1],
    status: "cancelled",
    scheduledFor: atOffset(3, 9, 30),
    createdAt: createdBefore(atOffset(3, 9, 30), 2),
  },
  {
    id: "apt_007",
    number: "APT-2007",
    customerId: "cust_004",
    customerName: "Taylor Brooks",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    serviceLabel: "Transmission diagnostics",
    notes: "Delayed gear engagement on cold start.",
    estimatedDurationMin: 110,
    contactPhone: "+1 555-0104",
    assignedMechanic: orderMechanicsFixture[2],
    status: "pending",
    scheduledFor: atOffset(5, 11, 0),
    createdAt: createdBefore(atOffset(5, 11, 0), 5),
  },
  {
    id: "apt_008",
    number: "APT-2008",
    customerId: "cust_001",
    customerName: "Alex Turner",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    serviceLabel: "Pre-trip safety inspection",
    notes: "Customer plans long-distance road trip.",
    estimatedDurationMin: 55,
    contactPhone: "+1 555-0101",
    assignedMechanic: orderMechanicsFixture[3],
    status: "pending",
    scheduledFor: atOffset(-2, 14, 40),
    createdAt: createdBefore(atOffset(-2, 14, 40), 3),
  },
];
