import { HttpResponse } from "msw";

export function parseRangeParam<TRange extends string>(
  input: string | null,
  options: {
    allowedRanges: readonly TRange[];
    defaultRange: TRange;
  },
): TRange | null {
  if (input === null) {
    return options.defaultRange;
  }

  return options.allowedRanges.includes(input as TRange) ? (input as TRange) : null;
}

export function invalidRangeResponse(message: string) {
  return HttpResponse.json(
    {
      code: "INVALID_RANGE",
      message,
    },
    { status: 400 },
  );
}
