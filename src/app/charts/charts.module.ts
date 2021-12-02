import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatteryGaugeComponent } from './battery-gauge/battery-gauge.component';
import { DualGaugeComponent } from './dual-gauge/dual-gauge.component';
import { RidingChartComponent} from './riding-chart/riding-chart.component';
import { BatteryChartComponent} from './battery-chart/battery-chart.component';
import { TemperatureChartComponent} from './temperature-chart/temperature-chart.component';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {IonicModule} from '@ionic/angular';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
  declarations: [
    BatteryGaugeComponent,
    DualGaugeComponent,
    RidingChartComponent,
    BatteryChartComponent,
    TemperatureChartComponent,
    OverviewChartComponent
  ],
    imports: [
        CommonModule,
        NgApexchartsModule,
        IonicModule,
        HighchartsChartModule
    ],
  exports: [
    BatteryGaugeComponent,
    DualGaugeComponent,
    RidingChartComponent,
    BatteryChartComponent,
    TemperatureChartComponent,
    OverviewChartComponent
  ]
})
export class ChartsModule { }
