export interface E3TableHeaderCol {
  id: string;
  label: string;
  transform?: (cellValue: any) => string;
}

export type E3TableHeader = E3TableHeaderCol[];

export type onClickFn = (
  cell: E3TableCell,
  col: E3TableHeaderCol,
  row: E3TableDataRow,
  rowIndex: number,
  colIndex: number
) => void;

export interface E3TableCell {
  value: any;
  formattedValue?: string;
  onClick?: onClickFn;
}

export interface E3TableDataRow {
  onClick?: onClickFn;
  link?: string[];
  className: string;
  cells: E3TableCell[];
}

export type E3TableData = E3TableDataRow[];
