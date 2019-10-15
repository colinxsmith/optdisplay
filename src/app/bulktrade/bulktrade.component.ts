import { Component, OnInit, OnChanges, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-bulktrade',
  template: `<svg id="BULK" width="0" height="0">
  <ng-container  *ngFor="let d of DATA.monitorFlagCategory; let i=index">
  <path [attr.class]="d.outlierStatusType.substr(0,1)"
  [attr.d]="arcPath(i)" [attr.transform]="translateHack(side/2,side/2)" (mouseenter)="onMouseEnter(DATA.label,d,i)"
  (mouseleave)="onMouseLeave(i)">
  </path>
  <text    [style.font-size]="fontSize"px  [attr.transform]="translateHack(side/2,side/2+(i-1)*160)">{{d.value}}</text>
  </ng-container>
  <text [style.font-size]="fontSize"px [attr.transform]="translateHack(side/2,side/2+320)">{{DATA.label}}</text>
  </svg>`,
  styles: [`#BULK path.O {
    fill: red;
}
#BULK path.N {
    fill: green;
}
#BULK path.A {
    fill: yellow;
}
#BULK text {
    font-size: 80px;
    fill: grey;
    text-anchor: middle;
}
g.tooltip2 {
  background: black;
  color: white;
  position: absolute;
  text-align: center;
  font-size: 12px;
  pointer-events: none;
  overflow: auto;
}
`]
})
export class BulktradeComponent implements OnInit, OnChanges {
  toolTipObj = d3.select(this.element.nativeElement).append('g').attr('class', 'tooltip2');
  rimAnagle = 0.08 * Math.PI * 2;
  scaleArc = d3.scaleLinear();
  fontSize: number;
  @Input() width = 800;
  @Input() height = 800;
  @Input() animate = true;
  @Input() durationTime = 2000;
  @Input() side: number;
  @Input() DATA = {
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
        value: 27,
        outlierStatusType: 'ALMOST OUTLIER'
      },
      {
        id: 3,
        value: 10,
        outlierStatusType: 'OUTLIER'
      }
    ]
  };
  onMouseEnter(label: string, data: {
    id: number;
    value: number;
    outlierStatusType: string;
  }, ii: number) {
    console.log(label, data, ii);
    const PATHS = (d3.select(this.element.nativeElement).selectAll('path').nodes()[ii] as SVGPathElement).getAttribute('transform');
    const MOUSE = PATHS.replace('translate(', '').replace(')', '').split(',');
    this.toolTipObj.attr('style', `left:${+MOUSE[0]}px;top:${+MOUSE[1]}px;display:inline-block`)
      .html(`${label}<br>${data.outlierStatusType}<br>${data.value}`);
  }
  onMouseLeave(ii: number) {
    console.log(ii);
    this.toolTipObj.attr('style', `display:none`)
      .html('');
  }
  constructor(private element: ElementRef) { }
  ngOnChanges() {
    this.setup();
    setTimeout(() => this.update());
  }
  ngOnInit() {
    this.setup();
    setTimeout(() => this.update());
  }
  setup() {
    console.log('setup', this.DATA);
    this.side = Math.min(this.width, this.height); // Needed in arcPath
    this.fontSize = this.side / 10;
    let totalV = 0;
    this.DATA.monitorFlagCategory.forEach(d => {
      totalV += d.value;
    });
    this.scaleArc.domain([0, totalV]).range([Math.PI + this.rimAnagle, 3 * Math.PI - this.rimAnagle]);
  }
  arcPath(i: number, t = 1) {
    //    console.log(i, t);
    let sofar = 0;
    for (let ii = 0; ii < i; ++ii) {
      sofar += this.DATA.monitorFlagCategory[ii].value;
    }
    const ARC = d3.arc().cornerRadius(10);
    //    console.log(sofar, sofar + this.DATA.monitorFlagCategory[i].value);
    //    console.log(this.scaleArc(sofar), this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value));
    return ARC({
      innerRadius: this.side / 2 * 0.7 * t, outerRadius: t * this.side / 2 * 0.8, startAngle: this.scaleArc(sofar)
      , endAngle: t * t * this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value), padAngle: 1 - t * t + 0.01
    });
  }
  translateHack(w: number, h: number) {
    return `translate(${w},${h})`;
  }
  update() {
    const id = this.element.nativeElement;
    d3.select(id).select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const fontSize = this.fontSize;
    const PATHS = d3.select(id).selectAll('path');
    const TEXTS = d3.select(id).selectAll('text');
    PATHS.data(this.DATA.monitorFlagCategory);
    if (this.animate) {
      PATHS.transition().duration(this.durationTime).tween('ppp', (d, i, j) => t => {
        const HERE = d3.select(j[i] as SVGPathElement);
        HERE.attr('d', this.arcPath(i, t));
      });
      TEXTS.transition().duration(this.durationTime * 2)
        .tween('ppp', (d, i, j) => t => {
          const HERE = d3.select(j[i] as SVGTextElement);
          HERE.style('font-size', t * fontSize + 'px');
          if (i <= 2) {
            HERE.attr('transform', `translate(${this.side / 2},${this.side / 2 + t * t * fontSize * 2 * (i - 1)})`);
          } else {
            HERE.attr('transform', `translate(${this.side / 2},${this.side / 2 * t + t * fontSize * 2 * (i - 1)}) rotate(${360 * t})`);
          }
        });
    } else {
      PATHS
        .attr('transform', `translate(${this.side / 2},${this.side / 2})`)
        .attr('d', (d, i) => this.arcPath(i));
      TEXTS
        .style('font-size', fontSize + 'px')
        .attr('transform', (d, i) => `translate(${this.side / 2},${this.side / 2 + fontSize * 2 * (i - 1)})`);
    }
  }
}
