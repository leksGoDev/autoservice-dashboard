export function isInsideDateRange(itemDateIso: string, from: string, to: string) {
  const timestamp = new Date(itemDateIso).getTime();

  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    if (timestamp < fromDate.getTime()) {
      return false;
    }
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    if (timestamp > toDate.getTime()) {
      return false;
    }
  }

  return true;
}
