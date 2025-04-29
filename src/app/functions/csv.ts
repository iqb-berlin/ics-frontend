export const csv = <T extends object>(data: Array<T>, delimiter = ','): Blob => {
  const sample = data[0];
  const headers = Object.keys(sample) as Array<keyof T>;
  const rows = data
    .map(row => headers
      .map(field => JSON.stringify(row[field] ?? ''))
      .join(delimiter)
    );
  const csvContent = [headers.join(delimiter), ...rows].join('\r\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}
