import { render, screen } from "@testing-library/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import type { CustomerListItem } from "@/entities/customer/model/types";
import type { ListResponse } from "@/shared/api/types";
import { I18nProvider } from "@/shared/i18n/provider";
import { CustomersRegistryContent } from "./CustomersRegistryContent";
import type { CustomersRegistryModel } from "../model/use-customers-registry-model";

function createModel(overrides: Partial<CustomersRegistryModel> = {}): CustomersRegistryModel {
  return {
    search: "",
    setSearch: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    query: {
      refetch: vi.fn(),
    } as unknown as UseQueryResult<ListResponse<CustomerListItem>, Error>,
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
