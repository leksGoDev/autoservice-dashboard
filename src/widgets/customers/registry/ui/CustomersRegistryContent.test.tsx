import { render, screen } from "@testing-library/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import type { CustomerListItem } from "@/entities/customer/model/types";
import type { ListResponse } from "@/shared/api/types";
import { I18nProvider } from "@/shared/i18n/provider";
import { CustomersRegistryContent } from "./CustomersRegistryContent";
import type { CustomersRegistryModel } from "../hooks/use-customers-registry-model";

function createQueryResult<TData>(
  overrides: Partial<UseQueryResult<TData, Error>> = {},
): UseQueryResult<TData, Error> {
  return {
    refetch: vi.fn(),
    isLoading: false,
    isError: false,
    isFetching: false,
    data: undefined,
    error: null,
    ...overrides,
  } as UseQueryResult<TData, Error>;
}

function createModel(overrides: Partial<CustomersRegistryModel> = {}): CustomersRegistryModel {
  return {
    search: "",
    setSearch: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    query: createQueryResult<ListResponse<CustomerListItem>>(),
    data: undefined,
    isLoading: false,
    isError: false,
    isEmpty: false,
    summary: "",
    pageLabel: "",
    handleSearchChange: vi.fn(),
    handlePrevPage: vi.fn(),
    handleNextPage: vi.fn(),
    ...overrides,
  };
}

describe("CustomersRegistryContent", () => {
  it("falls back to empty state when payload is missing after loading", () => {
    render(
      <I18nProvider>
        <CustomersRegistryContent model={createModel()} />
      </I18nProvider>,
    );

    expect(screen.getByText("No customers found.")).toBeInTheDocument();
  });
});
