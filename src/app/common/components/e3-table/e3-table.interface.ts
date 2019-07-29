export interface E3TableHeaderCol {
  id: string;
  label: string;
}
export type E3TableHeader = E3TableHeaderCol[];

export type onClickFn = (cell: any, col: E3TableHeaderCol, row: E3TableDataRow, rowIndex: number, colIndex: number) => void;
export interface E3TableCell {
  data: any;
  onClick?: onClickFn;
}

export interface E3TableDataRow {
  onClick?: onClickFn;
  link?: string[];
  [prop: string]: string | number | E3TableCell | onClickFn | string[];

}

export type E3TableData = E3TableDataRow[];
