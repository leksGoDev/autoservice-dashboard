import type { AppointmentStatus } from "@/entities/appointment/model/types";
import { customersFixture } from "@/mocks/fixtures/customers";
import { mechanicNamesFixture } from "@/mocks/fixtures/mechanics";

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

function getCustomerPhone(customerId: string) {
  return customersFixture.find((item) => item.id === customerId)?.phone ?? "+7 (901) 555-01-00";
}

export const appointmentsFixture: AppointmentFixtureItem[] = [
  {
    id: "apt_001",
    number: "APT-2001",
    customerId: "cust_001",
    customerName: "Aleksey Volkov",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    serviceLabel: "Brake diagnostics",
    notes: "Intermittent vibration while braking above 70 km/h.",
    estimatedDurationMin: 90,
    contactPhone: getCustomerPhone("cust_001"),
    assignedMechanic: mechanicNamesFixture[0],
    status: "pending",
    scheduledFor: atOffset(0, 10, 30),
    createdAt: createdBefore(atOffset(0, 10, 30), 2),
  },
  {
    id: "apt_002",
    number: "APT-2002",
    customerId: "cust_002",
    customerName: "Marina Kim",
    vehicleId: "veh_002",
    vehicleLabel: "2018 Nissan Altima",
    serviceLabel: "Engine warning check",
    notes: "Check engine light returned after last service.",
    estimatedDurationMin: 70,
    contactPhone: getCustomerPhone("cust_002"),
    assignedMechanic: mechanicNamesFixture[1],
    status: "confirmed",
    scheduledFor: atOffset(0, 8, 0),
    createdAt: createdBefore(atOffset(0, 8, 0), 1),
  },
  {
    id: "apt_003",
    number: "APT-2003",
    customerId: "cust_003",
    customerName: "Ilya Karpenko",
    vehicleId: "veh_003",
    vehicleLabel: "2020 Ford F-150",
    serviceLabel: "Suspension noise inspection",
    notes: "Noise appears on rough roads.",
    estimatedDurationMin: 80,
    contactPhone: getCustomerPhone("cust_003"),
    assignedMechanic: mechanicNamesFixture[2],
    status: "pending",
    scheduledFor: atOffset(1, 12, 15),
    createdAt: createdBefore(atOffset(1, 12, 15), 3),
  },
  {
    id: "apt_004",
    number: "APT-2004",
    customerId: "cust_004",
    customerName: "Darya Abdullaeva",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    serviceLabel: "A/C system diagnostics",
    notes: "Weak cooling after startup.",
    estimatedDurationMin: 60,
    contactPhone: getCustomerPhone("cust_004"),
    assignedMechanic: mechanicNamesFixture[3],
    status: "confirmed",
    scheduledFor: atOffset(2, 15, 45),
    createdAt: createdBefore(atOffset(2, 15, 45), 1),
  },
  {
    id: "apt_005",
    number: "APT-2005",
    customerId: "cust_005",
    customerName: "Ruslan Sokolov",
    vehicleId: "veh_005",
    vehicleLabel: "2022 Tesla Model S",
    serviceLabel: "Battery thermal check",
    notes: "Customer noticed reduced charging speed.",
    estimatedDurationMin: 95,
    contactPhone: getCustomerPhone("cust_005"),
    assignedMechanic: mechanicNamesFixture[0],
    status: "confirmed",
    scheduledFor: atOffset(-1, 16, 20),
    createdAt: createdBefore(atOffset(-1, 16, 20), 4),
  },
  {
    id: "apt_006",
    number: "APT-2006",
    customerId: "cust_002",
    customerName: "Marina Kim",
    vehicleId: "veh_002",
    vehicleLabel: "2018 Nissan Altima",
    serviceLabel: "Oil and filter maintenance",
    notes: "Regular maintenance interval.",
    estimatedDurationMin: 45,
    contactPhone: getCustomerPhone("cust_002"),
    assignedMechanic: mechanicNamesFixture[1],
    status: "cancelled",
    scheduledFor: atOffset(3, 9, 30),
    createdAt: createdBefore(atOffset(3, 9, 30), 2),
  },
  {
    id: "apt_007",
    number: "APT-2007",
    customerId: "cust_004",
    customerName: "Darya Abdullaeva",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    serviceLabel: "Transmission diagnostics",
    notes: "Delayed gear engagement on cold start.",
    estimatedDurationMin: 110,
    contactPhone: getCustomerPhone("cust_004"),
    assignedMechanic: mechanicNamesFixture[2],
    status: "pending",
    scheduledFor: atOffset(5, 11, 0),
    createdAt: createdBefore(atOffset(5, 11, 0), 5),
  },
  {
    id: "apt_008",
    number: "APT-2008",
    customerId: "cust_001",
    customerName: "Aleksey Volkov",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    serviceLabel: "Pre-trip safety inspection",
    notes: "Customer plans long-distance road trip.",
    estimatedDurationMin: 55,
    contactPhone: getCustomerPhone("cust_001"),
    assignedMechanic: mechanicNamesFixture[3],
    status: "pending",
    scheduledFor: atOffset(-2, 14, 40),
    createdAt: createdBefore(atOffset(-2, 14, 40), 3),
  },
];
