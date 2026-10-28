import { Injectable } from '@angular/core';

export interface IChartProps {
  data?: any;
  options?: any;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardChartsData {
  public mainChart: IChartProps = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Registrations',
          data: [],
          backgroundColor: 'rgba(0,123,255,0.5)',
          borderColor: 'rgba(0,123,255,1)',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        x: { display: true },
        y: { display: true },
      },
    },
  };

  initMainChart(period: string) {
    // Reset or update chart data based on 'period' (Day/Week/Month)
    this.mainChart.data.labels = [];
    this.mainChart.data.datasets[0].data = [];
  }

  getScales() {
    return { x: { display: true }, y: { display: true } };
  }
}
