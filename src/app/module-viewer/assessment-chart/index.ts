export type AssessmentChartSeries = {
    name: string;
    series: {
        name: number;
        value: number;
        label?: string;
        formattedValue?: number
    }[]
}[];

export type AssessmentChartActiveEntries = {name: string}[];