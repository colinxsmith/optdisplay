import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-proper',
  template: `<div id="place" style="margin-left:400px">
  <svg id="proper" class="new" width="800" height="900">
  <g *ngFor="let d of DATA; let i=index" (click)=clicked(d,i)>
      <rect  [attr.class]="d.x > 0 ? 'plus':'minus'" [attr.x]="d.x > 0 ? scaleX(0) : scaleX(d.x)"
      [attr.width]="(d.x < 0 ? scaleX(0) - scaleX(d.x) : scaleX(d.x) - scaleX(0))"
      [attr.y]="i*h/DATA.length+gap" [attr.height]="h/DATA.length*(1-2*gap)"></rect>
      <text [attr.x]="w/2" [attr.y]="(i+0.5)*h/DATA.length">Test Initial</text>
  </g>
</svg></div>`,
  styles: [`svg.bars {
    fill: red;
}

svg.new {
    fill:cornflowerblue;
    font-size:21px;
    text-anchor: middle;
}

svg.new rect {
    fill: cyan;
}
svg.new rect.plus{
    fill: lightgreen;
}
svg.new rect.minus{
    fill: red;
}`]
})
export class ProperComponent implements OnInit {
  DATA: { x: number }[];
  title='Proper Angular?';
  w: number;
  h: number;
  gap = 0.02;
  scaleX: d3.ScaleLinear<number, number>;
  BARS: d3.Selection<SVGGElement, {
    x: number;
  }, d3.BaseType, unknown>;
  constructor(private mainElement: ElementRef) { }
  ngOnInit() {
    this.setup();
    setTimeout(() => this.update());
  }
  setup() {
    if (!d3.select(this.mainElement.nativeElement).attr('data-title')) {
      d3.select(this.mainElement.nativeElement).attr('data-title', this.title);
    }
    console.log('init');
    this.DATA = [];
    const dLen = 10;
    for (let i = 0; i < dLen; ++i) {
      this.DATA.push({ x: ((i + 1) - 0.505 * dLen) * ((i + 1) - 0.405 * dLen) * ((i + 1) - 0.305 * dLen) });
    }
    this.w = Math.max(this.mainElement.nativeElement.offsetWidth,
      +d3.select(this.mainElement.nativeElement).select('#proper').attr('width'));
    this.h = Math.max(+d3.select(this.mainElement.nativeElement).select('#proper').attr('height'),
      this.mainElement.nativeElement.offsetHeight);
    this.scaleX = d3.scaleLinear().domain([d3.min(this.DATA.map(d => -Math.abs(d.x))),
    d3.max(this.DATA.map(d => Math.abs(d.x)))]).range([0, this.w]);
  }

  clicked(DA: { x: number }, i: number) {
    console.log('clicked', i);
    this.DATA[i].x = -this.DATA[i].x;
    const BARS = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    if (BARS !== undefined) {
      BARS.data(this.DATA);
      (BARS.nodes()[i] as SVGRectElement)
        .setAttribute('style', 'fill:' + (DA.x > 0 ? 'blue' : 'orange'));
    }
    this.update();
  }
  update() {
    const BARS = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    if (BARS !== undefined) {
      BARS.data(this.DATA);
      BARS.transition().duration(1000)
        .attrTween('x', (d: {
          x: number;
        }) => {
          return (t: number) => d.x > 0 ? '' + this.scaleX(0) : '' + this.scaleX(t * d.x);
        })
        .attrTween('width', (d: {
          x: number;
        }) => {
          return (t: number) => d.x < 0 ? '' + (this.scaleX(0) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(0));
        })
        ;
    }
    const TEXT = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('text');
    if (TEXT !== undefined) {
      TEXT.data(this.DATA);
      TEXT
        .transition().duration(1000)
        .tween('transform', (d: { x: number }, i, j) => t => {
          const here = d3.select(j[i] as SVGTextElement);
          here
            .text(() => `Text ${d3.format('0.3')(i + t)}`)
            .attr('x', 1000 * (1 - t))
            .attr('y', 1000 * (1 - t))
            .attr('transform', `translate(${this.scaleX(-(2 * t - 1) * d.x * 0.8)},
          ${(i + 0.5) * (1 + t) / 2 * this.h / this.DATA.length}) rotate(${90 * (1 - t) + t * -45})`);
        })
        ;
    }
  }
}
