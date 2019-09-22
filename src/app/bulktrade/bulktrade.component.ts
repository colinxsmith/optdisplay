import { Component, OnInit, ElementRef, ViewEncapsulation, AfterViewInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { easeBounce } from 'd3';
@Component({
  selector: 'app-bulktrade',
  template: `<svg id="BULK" width="800" height="800">
  <g  *ngFor="let d of DATA.monitorFlagCategory; let i=index">
  <path [attr.class]="d.outlierStatusType.substr(0,1)"
  [attr.d]="arcPath(i)" [attr.transform]="translateHack(side/2,side/2)">
  </path>
  <text [attr.transform]="translateHack(side/2,side/2+(i-1)*160)">{{d.value}}</text>
  </g>
  <text [attr.transform]="translateHack(side/2,side/2+320)">{{DATA.label}}</text>
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
.tooltip {
  background: black;
  color: white;
  position: absolute;
  text-align: center;
  font-size: 12px;
  pointer-events: none;
  overflow: auto;
}
`],
  encapsulation: ViewEncapsulation.None
})
export class BulktradeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() width = 800;
  @Input() height = 800;
  toolTipObj = d3.select('body').append('g').attr('class', 'tooltip');
  @Input() animate = true;
  @Input() side: number;
  @Input() fontSize: number;
  id: string;
  rimAnagle = 0.1 * Math.PI * 2;
  scaleArc = d3.scaleLinear();
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
  constructor(private element: ElementRef) { }
  ngOnChanges(ch: SimpleChanges) {
    console.log('onchanges', this.DATA);
  }
  ngAfterViewInit() {
    console.log('after view init', this.DATA);
    this.id = this.element.nativeElement;
    this.update();
  }
  ngOnInit() {
    console.log('on init', this.DATA);
    this.side = Math.min(this.width, this.height);
    let totalV = 0;
    this.DATA.monitorFlagCategory.forEach(d => {
      totalV += d.value;
    });
    this.scaleArc.domain([0, totalV]).range([Math.PI + this.rimAnagle, 3 * Math.PI - this.rimAnagle]);

  }
  arcPath(i: number) {
    //    console.log(i);
    let sofar = 0;
    for (let ii = 0; ii < i; ++ii) {
      sofar += this.DATA.monitorFlagCategory[ii].value;
    }
    const ARC = d3.arc().cornerRadius(10);
    //    console.log(sofar, sofar + this.DATA.monitorFlagCategory[i].value);
    //    console.log(this.scaleArc(sofar), this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value));
    return ARC({
      innerRadius: this.side / 2 * 0.7, outerRadius: this.side / 2 * 0.8, startAngle: this.scaleArc(sofar)
      , endAngle: this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value), padAngle: 0.01
    });
  }
  arcPathanim(i: number, t: number) {
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
    this.side = Math.min(this.width, this.height);
    this.fontSize = this.side / 10;
    d3.select(this.id).select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const PATHS = d3.select(this.id).selectAll('path');
    const TEXTS = d3.select(this.id).selectAll('text');
    PATHS.data(this.DATA.monitorFlagCategory);
    if (this.animate) {
      PATHS.transition().duration(2000).tween('ppp', (d, i, j) => t => {
        const HERE = d3.select(j[i] as SVGPathElement);
        HERE.attr('d', this.arcPathanim(i, t));
        HERE.on('mousemove', (dd: {
          id: number;
          value: number;
          outlierStatusType: string;
        }) => {
          this.toolTipObj.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
            .html(`${this.DATA.label}<br>${dd.outlierStatusType}<br>${dd.value}`);
        });
        HERE.on('mouseout', () => {
          this.toolTipObj.attr('style', `display:none`)
            .html('');
        });
      });
      TEXTS.transition().duration(2000)
        .ease(easeBounce)
        .tween('ppp', (d, i, j) => t => {
          const HERE = d3.select(j[i] as SVGTextElement);
          HERE.style('font-size', t * this.fontSize + 'px');
          HERE.attr('transform', `translate(${this.side / 2},${this.side / 2 + t * t * this.fontSize * 2 * (i - 1)})`);
        });
    } else {
      PATHS
        .attr('transform', `translate(${this.side / 2},${this.side / 2})`)
        .attr('d', (d, i) => this.arcPath(i));
      PATHS.on('mouseover', (d: {
        id: number;
        value: number;
        outlierStatusType: string;
      }) => {
        this.toolTipObj.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
          .html(`${this.DATA.label}<br>${d.outlierStatusType}<br>${d.value}`);
      })
        .on('mouseout', () => {
          this.toolTipObj.attr('style', `display:none`)
            .html('');
        });
      TEXTS
        .style('font-size', this.fontSize + 'px')
        .attr('transform', (d, i) => `translate(${this.side / 2},${this.side / 2 + this.fontSize * 2 * (i - 1)})`);
    }
  }
}

