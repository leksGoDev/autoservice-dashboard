import type { CreateCustomerPayload, Customer, UpdateCustomerPayload } from "@/entities/customer/model/types";
import { customersFixture } from "@/mocks/fixtures/customers";

let customersState: Customer[] = customersFixture.map((customer) => ({ ...customer }));

function getNextCustomerSequence() {
  const maxSequence = customersState.reduce((max, customer) => {
    const sequence = Number(customer.id.replace(/\D/g, ""));
    return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
  }, 0);

  return maxSequence + 1;
}

function buildCustomerId(sequence: number) {
  return `cust_${String(sequence).padStart(3, "0")}`;
}

function toCustomerSnapshot(customer: Customer): Customer {
  return { ...customer };
}

export function getCustomersMockState() {
  return customersState.map(toCustomerSnapshot);
}

export function getCustomerMockState(customerId: string) {
  const customer = customersState.find((item) => item.id === customerId);
  return customer ? toCustomerSnapshot(customer) : undefined;
}

export function createCustomerState(payload: CreateCustomerPayload): Customer {
  const nextCustomer: Customer = {
    id: buildCustomerId(getNextCustomerSequence()),
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    loyaltyTier: payload.loyaltyTier ?? "standard",
  };

  customersState.push(nextCustomer);
  return toCustomerSnapshot(nextCustomer);
}

export function updateCustomerState(customerId: string, payload: UpdateCustomerPayload): Customer | undefined {
  const customerIndex = customersState.findIndex((item) => item.id === customerId);

  if (customerIndex < 0) {
    return undefined;
  }

  const nextCustomer: Customer = {
    ...customersState[customerIndex],
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    loyaltyTier: payload.loyaltyTier,
  };

  customersState[customerIndex] = nextCustomer;

  return toCustomerSnapshot(nextCustomer);
}

export function resetCustomersMockState() {
  customersState = customersFixture.map((customer) => ({ ...customer }));
}
