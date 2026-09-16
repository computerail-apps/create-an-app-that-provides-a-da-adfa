export interface SeriesDef {
  id: string;
  label: string;
  unit: string;
  frequencyLabel: string;
  description: string;
}

export const TRACKED_SERIES: SeriesDef[] = [
  {
    id: 'CPIAUCSL',
    label: 'CPI (All Urban Consumers)',
    unit: 'Index 1982-84=100',
    frequencyLabel: 'Monthly',
    description: 'Headline inflation gauge — consumer price index.',
  },
  {
    id: 'UNRATE',
    label: 'Unemployment Rate',
    unit: '%',
    frequencyLabel: 'Monthly',
    description: 'Share of the labor force that is jobless and seeking work.',
  },
  {
    id: 'ICSA',
    label: 'Initial Jobless Claims',
    unit: 'Claims',
    frequencyLabel: 'Weekly',
    description: 'New unemployment insurance claims filed nationwide.',
  },
  {
    id: 'FEDFUNDS',
    label: 'Effective Fed Funds Rate',
    unit: '%',
    frequencyLabel: 'Monthly',
    description: 'Effective interest rate on overnight interbank lending.',
  },
  {
    id: 'DGS10',
    label: '10-Year Treasury Yield',
    unit: '%',
    frequencyLabel: 'Daily',
    description: 'Market yield on 10-year US Treasury securities.',
  },
  {
    id: 'GDPC1',
    label: 'Real GDP',
    unit: 'Billions, Chained 2017 $',
    frequencyLabel: 'Quarterly',
    description: 'Inflation-adjusted output of the US economy.',
  },
];
