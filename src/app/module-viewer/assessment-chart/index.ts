export type AssessmentChartSeries = {
  name: string;
  series: {
    name: number;
    value: number;
    label?: string;
    formattedValue?: string;
  }[];
}[];

export type AssessmentChartActiveEntries = { name: string }[];
