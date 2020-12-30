import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-pillar3',
  templateUrl: './pillar3.component.html',
  styleUrls: ['./pillar3.component.css']
})
export class Pillar3Component implements OnInit, OnChanges {

  @Input() ww = 500;
  @Input() hh = 500;
  @Input() left = 100;
  @Input() right = 50;
  @Input() top = 15;
  @Input() bottom = 0;
  @Input() nolines = false;
  @Input() pillars: {};
  @Input() leftlabel = false;
  ESG: string[];
  plotP: number[][] = [];
  @Input() Classes = ['bad', 'poor', 'mediocre', 'average', 'good', 'excellent', 'nodata'];
  constructor(private element: ElementRef) { }
  scaleX = d3.scaleLinear().domain([0, 3]);
  scaleY = d3.scaleLinear().domain([0, 1]);

  ngOnInit() {
    //   console.log(this.Classes);
    if (this.pillars !== undefined) {
      this.setup();
    }
  }
  ngOnChanges(aaa: SimpleChanges) {
    //   console.log(this.Classes,aaa.Classes&&aaa.Classes.firstChange);
    if (aaa.pillars !== undefined) {
      this.setup();
    }
  }
  setup() {
    this.scaleX.range([this.left, this.ww - this.right]);
    this.scaleY.range([this.hh - this.bottom, this.top]);
    this.ESG = Object.keys(this.pillars);
    this.plotP = [];
    this.ESG.forEach(pp => {
      const tot = d3.sum(this.pillars[pp]);
      let y = 0;
      const ppp: number[] = [];
      ppp.push(0);
      this.pillars[pp].forEach((d, i: number) => {
        y += this.pillars[pp][i] / tot;
        ppp.push(y);
      });
      this.plotP.push(ppp);
    });
    //   console.log(this.plotP);
    this.update();
  }
  update() {
    setTimeout(() => {

      d3.select(this.element.nativeElement).selectAll('text')
        .transition().duration(3000)
        .attrTween('transform', () => t => `rotate(${(1 - t) * 90})`);
      d3.select(this.element.nativeElement).selectAll('path')
        .transition().duration(3000)
        .attrTween('d', (d, ij) => t => {
          const tt = t * t * t;
          const i = Math.floor(ij / this.Classes.length);
          const j = Math.floor(ij % this.Classes.length);
          const pillar = this.plotP[i];
          const w = this.scaleX(i + 1) - this.scaleX(i);
          const h = this.scaleY(pillar[j]) - this.scaleY(pillar[j + 1]);
          const x = this.scaleX(i);
          const y = this.scaleY(pillar[j + 1]);
          return `${this.curvePath((w), (h), (x), (y), tt)}`;
        });
    });
  }
  rectPath = (w: number, h: number, x: number, y: number) => `M${x},${y} l${w},0 l 0,${h} l${-w},0 z`;
  curvePath = (w: number, h: number, x: number, y: number, t = 0) =>
    `M${x},${y}
  h ${w * t}
  q ${w * (1 - t)},${0} ${w * (1 - t)},${h}
  h${-w} z`
}
