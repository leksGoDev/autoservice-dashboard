import { renderHook } from "@testing-library/react";
import { useParams } from "react-router-dom";

import { useOrderDetailsPageModel } from "./use-order-details-model";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

const mockedUseParams = vi.mocked(useParams);

describe("useOrderDetailsPageModel", () => {
  beforeEach(() => {
    mockedUseParams.mockReset();
  });

  it("returns orderId from route params", () => {
    mockedUseParams.mockReturnValue({ orderId: "ord_001" });

    const { result } = renderHook(() => useOrderDetailsPageModel());

    expect(result.current.orderId).toBe("ord_001");
  });

  it("keeps undefined when route param is missing", () => {
    mockedUseParams.mockReturnValue({});

    const { result } = renderHook(() => useOrderDetailsPageModel());

    expect(result.current.orderId).toBeUndefined();
  });
});
