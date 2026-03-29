import { delay, http, HttpResponse } from "msw";

import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { createCustomerState } from "@/mocks/state/customers";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { buildCustomerDetails, buildCustomersRegistry } from "./builders";
import { parseCreateCustomerPayload } from "./validators";

export const customersHandlers = [
  http.get(toMswPath(apiEndpoints.customers.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const { page, pageSize, search } = parseListQueryParams(url);

    let filtered = buildCustomersRegistry();

    if (search) {
      filtered = filtered.filter((customer) => {
        const haystack = `${customer.fullName} ${customer.phone} ${customer.email}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    return HttpResponse.json(paginateItems(filtered, page, pageSize));
  }),
  http.get(toMswPath(apiEndpoints.customers.detail(":customerId")), async ({ params }) => {
    await delay(250);

    const customerId = String(params.customerId);
    const details = buildCustomerDetails(customerId);

    if (!details) {
      return HttpResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return HttpResponse.json(details);
  }),
  http.post(toMswPath(apiEndpoints.customers.list), async ({ request }) => {
    await delay(250);

    const body = (await request.json().catch(() => null)) as
      | Partial<{ fullName: string; phone: string; email: string; loyaltyTier: "standard" | "silver" | "gold" }>
      | null;
    const payload = parseCreateCustomerPayload(body);

    if (!payload) {
      return HttpResponse.json({ message: "Invalid customer payload" }, { status: 400 });
    }

    const created = createCustomerState({
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      loyaltyTier: payload.loyaltyTier,
    });

    return HttpResponse.json(
      {
        ...created,
        vehiclesCount: 0,
        ordersCount: 0,
        lastVisitAt: null,
      },
      { status: 201 },
    );
  }),
];
