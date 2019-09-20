import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bulktrade',
  template: `<svg id="BULK" width="800" height="800">
  <g  *ngFor="let d of DATA.monitorFlagCategory; let i=index">
  <path [attr.d]="arcPath(i)" [attr.transform]="translateHack(side/2,side/2)">
  </path>
  </g>
  </svg>`,
  styleUrls: ['./bulktrade.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BulktradeComponent implements OnInit {
  w: number;
  h: number;
  side: number;
  scaleArc = d3.scaleLinear();
  DATA = {
    id: 1,
    type: 'stockLevelTotalRisk',
    label: 'RISK',
    chartType: 'STATUS',
    monitorFlagCategory: [
      {
        id: 1,
        value: 18,
        outlierStatusType: 'NOT OUTLIER'
      },
      {
        id: 2,
        value: 1,
        outlierStatusType: 'ALMOST OUTLIER'
      },
      {
        id: 3,
        value: 1,
        outlierStatusType: 'OUTLIER'
      }
    ]
  };
  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.w = Math.max(this.element.nativeElement.offsetWidth, +d3.select(this.element.nativeElement).select('#BULK').attr('width'));
    this.h = Math.max(this.element.nativeElement.offsetHeight, +d3.select(this.element.nativeElement).select('#BULK').attr('height'));
    this.side = Math.min(this.w, this.h);
    console.log(this.w, this.h);
    let totalV = 0;
    this.DATA.monitorFlagCategory.forEach(d => {
      totalV += d.value;
    });
    this.scaleArc.domain([0, totalV]).range([0, 2 * Math.PI]);

  }
  arcPath(i: number) {
    console.log(i);
    let sofar = 0;
    for (let ii = 0; ii < i; ++ii) {
      sofar += this.DATA.monitorFlagCategory[ii].value;
    }
    console.log(sofar, sofar + this.DATA.monitorFlagCategory[i].value);
    console.log(this.scaleArc(sofar), this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value));
    return d3.arc()({
      innerRadius: this.side / 2 * 0.7, outerRadius: this.side / 2 * 0.8, startAngle: this.scaleArc(sofar)
      , endAngle: this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value), padAngle: 1
    });
  }
  translateHack(w: number, h: number) {
    return `translate(${w},${h})`;
  }
}
