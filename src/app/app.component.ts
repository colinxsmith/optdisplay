import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'optdisplay';
  routes = {
    optlog: 'Optimiser Log Optimisation',
    etl: 'ETL Optimisation',
    gauge: 'NEW GAUGES',
    proper: 'Test Angular',
    bulk: 'Bulk Trade Dial in Angular',
    bulkbar: 'Bulk Trade Bar in Angular',
    bulktest: 'Bulk Trade Dial Test',
    bubbles: 'General Bubbles Chart',
    receive: 'Receiver Bar Test',
    radar: 'Angular Radar Chart',
    vertbar: 'Bar Chart',
    dartboard: 'Dart Board'
  };
  rKeys = Object.keys(this.routes);
}
