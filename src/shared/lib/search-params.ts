export function readPositiveNumberParam(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function applySearchParamsPatch(
  source: URLSearchParams,
  patch: Record<string, string>,
): URLSearchParams {
  const next = new URLSearchParams(source);

  Object.entries(patch).forEach(([key, value]) => {
    if (!value) {
      next.delete(key);
      return;
    }

    next.set(key, value);
  });

  return next;
}
