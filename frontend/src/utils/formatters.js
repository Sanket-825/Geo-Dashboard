export function filterByStatus(data, status) {
  if (!status) return data;
  return data.filter((item) => item.status === status);
}
