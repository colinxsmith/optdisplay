import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DispComponent } from './disp/disp.component';
import { DataService } from './data.service';
import { EtlComponent } from './etl/etl.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewgaugeComponent } from './newgauge/newgauge.component';
import { ProperComponent } from './proper/proper.component';
import { BulkTradeComponent } from './bulk-trade/bulk-trade.component';
import { BulktestComponent } from './bulk-test/bulk-test.component';
import { BulkTradeBarComponent } from './bulk-trade-bar/bulk-trade-bar.component';
import { BubbletableComponent } from './bubbletable/bubbletable.component';
import { RecComponent } from './rec/rec.component';
import { RadarComponent } from './radar/radar.component';
import { UseRadarComponent } from './use-radar/use-radar.component';
import { VertBarChartComponent } from './vert-bar-chart/vert-bar-chart.component';
import { DartboardComponent } from './dartboard/dartboard.component';
import { UsedartComponent } from './usedart/usedart.component';
import { FlowerComponent } from './flower/flower.component';
import { Pillar3Component } from './pillar3/pillar3.component';
import { PreferenceComponent } from './preference/preference.component';
const appRoutes: Routes = [
  { path: 'optlog', component: DispComponent },
  { path: 'etl', component: EtlComponent },
  { path: 'proper', component: ProperComponent },
  { path: 'gauge', component: NewgaugeComponent },
  { path: 'bulk', component: BulkTradeComponent },
  { path: 'bulkbar', component: BulkTradeBarComponent },
  { path: 'bulktest', component: BulktestComponent },
  { path: 'bubbles', component: BubbletableComponent },
  { path: 'receive', component: RecComponent },
  { path: 'radar', component: UseRadarComponent },
  { path: 'vertbar', component: VertBarChartComponent },
  { path: 'dartboard', component: UsedartComponent },
  { path: '', redirectTo: '/etl', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DispComponent,
    EtlComponent,
    PageNotFoundComponent,
    NewgaugeComponent,
    ProperComponent,
    BulkTradeComponent,
    BulktestComponent,
    BulkTradeBarComponent,
    BubbletableComponent,
    RecComponent,
    RadarComponent,
    UseRadarComponent,
    VertBarChartComponent,
    DartboardComponent,
    UsedartComponent,
    FlowerComponent,
    Pillar3Component,
    PreferenceComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
