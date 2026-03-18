import type { AppLocale } from "@/shared/i18n/config";

export const CUSTOMERS_REGISTRY_PAGE_SIZE = 4;

export interface CustomerRegistryRow {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  vehiclesCount: number;
  ordersCount: number;
  lastVisitAt: string | null;
}

export interface CustomersRegistryResult {
  items: CustomerRegistryRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const filterCustomersRegistryRows = (
  rows: CustomerRegistryRow[],
  search: string,
): CustomerRegistryRow[] => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return rows;
  }

  return rows.filter((item) => {
    const haystack = `${item.fullName} ${item.phone} ${item.email}`.toLowerCase();
    return haystack.includes(normalizedSearch);
  });
};

export const paginateCustomersRegistryRows = (
  rows: CustomerRegistryRow[],
  page: number,
  pageSize: number,
): CustomersRegistryResult => {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: rows.slice(startIndex, startIndex + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
};

export const formatCustomersRegistryDate = (
  value: string | null,
  locale: AppLocale,
  unknownLabel: string,
): string => {
  if (!value) {
    return unknownLabel;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return unknownLabel;
  }

  return new Date(timestamp).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
