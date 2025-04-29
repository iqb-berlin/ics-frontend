import { isArrayOfSameShapedObjects } from './type-guards';

const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const toJSONBlob = (data: unknown): Blob =>
  new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

const toCSVBlob = <T extends  object>(data: unknown, delimiter = ','): Blob => {
  if (!isArrayOfSameShapedObjects<T>(data)) throw new Error('Can not write array of differently shaped objects as CSV!');
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

export const download = (data: unknown) => ({
  asJSON: (filename: string) => downloadFile(toJSONBlob(data), filename),
  asCSV: (filename: string) => downloadFile(toCSVBlob(data), filename)
});

