import { Component } from '@angular/core';
export const reOrder = function (n: number, order: Array<number>, x: Array<any>) {
  const marked: Array<boolean> = Array(n);
  for (let i = 0; i < n; ++i)marked[i] = false;
  for (let i = 0; i < n; ++i) {
    if (!marked[i]) {
      for (let j = i, k = order[j]; k !== i; k = order[j = k]) {
        const l = x[k];
        x[k] = x[j];
        x[j] = l;
        marked[k] = true;
      }
      marked[i] = true;
    }
  }
}
export const csvline2datas = (line: any, datasHere: HIERACH, tier: Array<string>, ntier: number, name = 'name', attribute = 'weight') => {
  let tierfound = false;
  let addSize = ntier === tier.length;
  const newDatas: HIERACH = {
    name: addSize ? line[name] : line[tier[ntier]],
    children: [],
    size: addSize ? line[attribute] : undefined,
    index: undefined
  }
  if (datasHere.children.length === 0) {
    if (!addSize) csvline2datas(line, newDatas, tier, ntier + 1, name, attribute);
    datasHere.children.push(newDatas);
  } else {
    datasHere.children.forEach(ch => {
      if (ch.name === line[tier[ntier]]) {
        tierfound = true;
        if (!addSize) csvline2datas(line, ch, tier, ntier + 1, name, attribute);
      }
    });
    if (!tierfound) {
      if (!addSize) csvline2datas(line, newDatas, tier, ntier + 1, name, attribute);
      datasHere.children.push(newDatas);
    }
  }
}
export interface BASICDATA { gac: string; tac: string; sac: string; name: string; weight: number; }
export interface HIERACH { children: HIERACH[]; name: string; index: number; size: number; }
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
