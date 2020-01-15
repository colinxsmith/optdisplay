import { Component, OnInit, OnChanges, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { select } from 'd3';
@Component({
  selector: 'app-bulk-trade',
  template: `<svg  id="BULK" width="0" height="0" [style.background-color]="bcolor">
  <ng-container  *ngFor="let d of DATA.monitorFlagCategory; let i=index">
  <path [attr.class]="d.outlierStatusType.substr(0,1)"
  [attr.d]="arcPath(i)" [attr.transform]="translateHack(side/2,side/2)"
  (mouseenter)="onMouseEnter(DATA.label,d,$event)"
  (mouseleave)="onMouseLeave()">
  </path>
  <text   [attr.class]="d.outlierStatusType.substr(0,1)"
   [style.font-size]="fontSize"px  [attr.transform]="translateHack(side/2,side/2+(i-1)*160)">{{d.value}}</text>
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
#BULK text.O {
  fill: red;
}
#BULK text.N {
  fill: green;
}
#BULK text.A {
  fill: yellow;
}
#BULK text {
    font-size: 80px;
    fill: grey;
    text-anchor: middle;
}
:host {
  background-color:darksalmon;
}
`]
})
export class BulkTradeComponent implements OnInit, OnChanges {
  rimAngle = 0.08 * Math.PI * 2;
  scaleArc = d3.scaleLinear();
  fontSize: number;

  eps = Math.abs((4 / 3 - 1) * 3 - 1);
  myAttr = false;
  myTitle = false;
  @Input() bcolor = '';
  @Input() square = true;
  @Input() toolTipObj = d3.select('app-root').select('div.mainTip');
  @Input() width = 800;
  @Input() height = 800;
  @Input() animate = true;
  @Input() durationTime = 2000;
  @Input() title = 'BULK';
  side: number;
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
  }, ee: MouseEvent) {
    const ww = (ee.x - (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().left)
      /  (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().width;
    const hh = (ee.y - (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().top)
      /  (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().height;
//    console.log(ww, hh);
    d3.select(this.element.nativeElement).style('--xx', `${100 * ww}%`);
    d3.select(this.element.nativeElement).style('--yy', `${100 * hh}%`);
    d3.select(this.element.nativeElement).style('--back', 'blue');
    d3.select(this.element.nativeElement).attr('title', `${ee.x},${ee.y}`);
    if (this.myAttr) {
      d3.select(this.element.nativeElement).attr('smallgreytitle', `${ee.pageX},${ee.pageY}`);
    }
    if (this.myTitle) {
      d3.select(this.element.nativeElement).attr('greentitle', `${ee.pageX},${ee.pageY}`);
    }
    this.toolTipObj.attr('style', `left:${ee.x}px;top:${ee.y}px;display:inline-block`)
      .html(`${label}<br>${data.outlierStatusType}<br>${data.value}`)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${t * t}`);
  }
  onMouseLeave() {
    d3.select(this.element.nativeElement).style('--xx', '0%');
    d3.select(this.element.nativeElement).style('--yy', '0%');
    d3.select(this.element.nativeElement).style('--back', 'red');
    d3.select(this.element.nativeElement).attr('title', this.title);
    if (this.myAttr) {
      d3.select(this.element.nativeElement).attr('smallgreytitle', this.title);
    }
    if (this.myTitle) {
      d3.select(this.element.nativeElement).attr('greentitle', this.title);
    }
    this.toolTipObj.attr('style', `display:none`)
      .html('').transition().duration(200).styleTween('opacity', () => t => `${1 - t * t}`);
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
    if (this.bcolor === '') {
      this.bcolor = d3.select(this.element.nativeElement).style('background-color');
    }
    if (d3.select(this.element.nativeElement).attr('greentitle') === null &&
      d3.select(this.element.nativeElement).attr('smallgreytitle') === null) {
      d3.select(this.element.nativeElement).attr('smallgreytitle', this.title);
    }
    if (d3.select(this.element.nativeElement).attr('greentitle') !== null) {
      this.title = d3.select(this.element.nativeElement).attr('greentitle');
      this.myTitle = true;
    }
    if (d3.select(this.element.nativeElement).attr('smallgreytitle') !== null) {
      this.title = d3.select(this.element.nativeElement).attr('smallgreytitle');
      this.myAttr = true;
    }
    this.side = Math.min(this.width, this.height); // Needed in arcPath
    this.fontSize = this.side / 8;
    let totalV = 0;
    this.DATA.monitorFlagCategory.forEach(d => {
      totalV += d.value;
    });
    this.scaleArc.domain([0, totalV]).range([Math.PI + this.rimAngle, 3 * Math.PI - this.rimAngle]);
  }
  arcPath(i: number, t = 1) {
    let sofar = 0;
    for (let ii = 0; ii < i; ++ii) {
      sofar += this.DATA.monitorFlagCategory[ii].value;
    }
    const ARC = t < 0.8 ? d3.arc().cornerRadius(20) : this.square ? this.squareArc : d3.arc().cornerRadius(10);
    return ARC({
      innerRadius: this.side / 2 * 0.7 * t, outerRadius: t * this.side / 2 * 0.8, startAngle: this.scaleArc(sofar)
      , endAngle: t * t * this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value), padAngle: t * t * 0.01
    });
  }
  centroid(i: number, t = 1) {
    let sofar = 0;
    for (let ii = 0; ii < i; ++ii) {
      sofar += this.DATA.monitorFlagCategory[ii].value;
    }
    const ARC = d3.arc().cornerRadius(10);
    return ARC.centroid({
      innerRadius: this.side / 2 * 0.7 * t, outerRadius: t * this.side / 2 * 0.8, startAngle: this.scaleArc(sofar)
      , endAngle: t * t * this.scaleArc(sofar + this.DATA.monitorFlagCategory[i].value), padAngle: 0
    });
  }
  translateHack(w: number, h: number) {
    return `translate(${w},${h})`;
  }
  update() {
    const id = this.element.nativeElement as HTMLElement;
    const fontSize = this.fontSize;
    const font3 = fontSize * 1.1;
    d3.select(id).select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const PATHS: d3.Selection<SVGPathElement, number, any, unknown> = d3.select(id).selectAll('path');
    const TEXTS: d3.Selection<SVGTextElement, unknown, any, unknown> = d3.select(id).selectAll('text');
    const bottomText = TEXTS.filter((d, i) => i === 3);
    bottomText.style('font-size', `${font3}px`);
    this.rimAngle = Math.asin((bottomText.node() as SVGTextElement).getBoundingClientRect().width / this.side / 0.7);
    this.scaleArc.range([Math.PI + this.rimAngle, Math.PI * 3 - this.rimAngle]);
    PATHS.data(this.DATA.monitorFlagCategory);
    if (this.animate) {
      PATHS.transition().duration(this.durationTime).tween('ppp', (d, i, j) => t => {
        const HERE = d3.select(j[i] as SVGPathElement);
        HERE.attr('d', this.arcPath(i, t));
      });
      TEXTS.transition().duration(this.durationTime * 2)
        .tween('ppp', (d, i, j) => t => {
          const HERE = d3.select(j[i] as SVGTextElement);
          if (i <= 2) {
            HERE.style('font-size', t * fontSize + 'px');
            const tH = j[i].getBoundingClientRect().height;
            HERE.attr('transform', `translate(${this.side / 2},${this.side / 2 + t * t * tH * (i - 1)})`);
          } else {
            HERE.style('font-size', t * font3 + 'px');
            const tH = j[i].getBoundingClientRect().height;
            HERE.attr('transform', `translate(${this.side / 2},${this.side * t - t * tH * 0.5}) rotate(${360 * t})`);
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
  squareArc = (parm: { outerRadius: number, innerRadius: number, startAngle: number, endAngle: number, padAngle: number }) => {
    if (parm.endAngle - parm.startAngle <= parm.padAngle) {
      parm.padAngle = 0;
    }
    parm.startAngle -= Math.PI * 0.5 - parm.padAngle;
    parm.endAngle -= Math.PI * 0.5 + parm.padAngle;
    const makeZ = (x: number) => Math.abs(x) < this.eps ? 0 : x;
    const seg1 = { xx1: 0, xx2: 0, yy1: 0, yy2: 0 };
    const seg2 = { xx1: 0, xx2: 0, yy1: 0, yy2: 0, face: 0 };
    if (parm.innerRadius === 0) {
      parm.innerRadius = this.eps;
    }
    if (parm.outerRadius === 0) {
      parm.outerRadius = this.eps;
    }
    seg1.xx1 = parm.innerRadius * Math.cos(parm.startAngle);
    seg1.yy1 = parm.innerRadius * Math.sin(parm.startAngle);
    if (Math.abs(seg1.xx1) > Math.abs(seg1.yy1)) {
      seg1.yy1 *= Math.abs(parm.innerRadius / seg1.xx1);
      seg1.xx1 = seg1.xx1 < 0 ? -parm.innerRadius : parm.innerRadius;
    } else {
      seg1.xx1 *= Math.abs(parm.innerRadius / seg1.yy1);
      seg1.yy1 = seg1.yy1 < 0 ? -parm.innerRadius : parm.innerRadius;
    }
    seg1.xx2 = parm.outerRadius * Math.cos(parm.startAngle);
    seg1.yy2 = parm.outerRadius * Math.sin(parm.startAngle);
    if (Math.abs(seg1.xx2) > Math.abs(seg1.yy2)) {
      seg1.yy2 *= Math.abs(parm.outerRadius / seg1.xx2);
      seg1.xx2 = seg1.xx2 < 0 ? -parm.outerRadius : parm.outerRadius;
    } else {
      seg1.xx2 *= Math.abs(parm.outerRadius / seg1.yy2);
      seg1.yy2 = seg1.yy2 < 0 ? -parm.outerRadius : parm.outerRadius;
    }
    seg2.xx1 = parm.innerRadius * Math.cos(parm.endAngle);
    seg2.yy1 = parm.innerRadius * Math.sin(parm.endAngle);
    if (Math.abs(seg2.xx1) > Math.abs(seg2.yy1)) {
      seg2.yy1 *= Math.abs(parm.innerRadius / seg2.xx1);
      seg2.xx1 = seg2.xx1 < 0 ? -parm.innerRadius : parm.innerRadius;
    } else {
      seg2.xx1 *= Math.abs(parm.innerRadius / seg2.yy1);
      seg2.yy1 = seg2.yy1 < 0 ? -parm.innerRadius : parm.innerRadius;
    }
    seg2.xx2 = parm.outerRadius * Math.cos(parm.endAngle);
    seg2.yy2 = parm.outerRadius * Math.sin(parm.endAngle);
    if (Math.abs(seg2.xx2) > Math.abs(seg2.yy2)) {
      seg2.yy2 *= Math.abs(parm.outerRadius / seg2.xx2);
      seg2.xx2 = seg2.xx2 < 0 ? -parm.outerRadius : parm.outerRadius;
    } else {
      seg2.xx2 *= Math.abs(parm.outerRadius / seg2.yy2);
      seg2.yy2 = seg2.yy2 < 0 ? -parm.outerRadius : parm.outerRadius;
    }
    if (seg1.xx1 === -parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // both left side
      if (seg2.yy1 <= seg1.yy1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.yy1 === -parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // both top side
      if (seg2.xx1 >= seg1.xx1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.xx1 === parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // both right side
      if (seg2.yy1 >= seg1.yy1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.yy1 === parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // both bottom side
      if (seg2.xx1 <= seg1.xx1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.xx1 === -parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // left to top
      seg2.face = 1;
    } else if (seg1.xx1 === -parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // left to right
      seg2.face = 2;
    } else if (seg1.xx1 === -parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // left to bottom
      seg2.face = 3;
    } else if (seg1.yy1 === -parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // top to right
      seg2.face = 1;
    } else if (seg1.yy1 === -parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // top to bottom
      seg2.face = 2;
    } else if (seg1.yy1 === -parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // top to left
      seg2.face = 3;
    } else if (seg1.xx1 === parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // right to bottom
      seg2.face = 1;
    } else if (seg1.xx1 === parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // right to left
      seg2.face = 2;
    } else if (seg1.xx1 === parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // right to top
      seg2.face = 3;
    } else if (seg1.yy1 === parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // bottom to left
      seg2.face = 1;
    } else if (seg1.yy1 === parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // bottom to top
      seg2.face = 2;
    } else if (seg1.yy1 === parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // bottom to right
      seg2.face = 3;
    }
    let quadR = 'M ' + seg1.xx2 + ' ' + seg1.yy2 + ' L ' + seg1.xx1 + ' ' + seg1.yy1;
    seg1.xx1 = makeZ(seg1.xx1);
    seg1.yy1 = makeZ(seg1.yy1);
    seg1.xx2 = makeZ(seg1.xx2);
    seg1.yy2 = makeZ(seg1.yy2);
    seg2.xx1 = makeZ(seg2.xx1);
    seg2.yy1 = makeZ(seg2.yy1);
    seg2.xx2 = makeZ(seg2.xx2);
    seg2.yy2 = makeZ(seg2.yy2);
    if (seg2.face === 0) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 1) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 2) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 3) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 4) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    }
    quadR += 'Z'; // Closed curve
    return quadR;
  }
}
