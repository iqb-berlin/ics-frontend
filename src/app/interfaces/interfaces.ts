export interface Service {
  name: string;
  url: string;
}

export interface Option {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select';
  value: number | string;
  range?: [number, number];
  options?: string[];
}
