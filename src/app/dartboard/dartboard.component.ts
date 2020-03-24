import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { rgb } from 'd3';

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css']
})
export class DartboardComponent implements OnChanges {
  @Input() esgColour = {
    0: d3.rgb(255, 59, 48),
    1: d3.rgb(255, 149, 0),
    2: d3.rgb(255, 230, 32),
    3: d3.rgb(0, 245, 234),
    4: d3.rgb(4, 222, 113),
    5: d3.rgb(90, 200, 2),
    8: d3.rgb(119, 119, 119),
    E: rgb(120, 122, 255),
    S: rgb(32, 148, 250),
    G: rgb(90, 200, 250)
  };

  colours: d3.ScaleLinear<d3.RGBColor, string>;
  eps = Math.abs((4 / 3 - 1) * 3 - 1);
  @Input() topcolour = 'red';
  @Input() colourgamma = 0.75;
  @Input() title = 'DARTBOARD';
  @Input() smallgreytitle: string;
  ww = 960;
  hh = this.ww;
  maxdepth = 0;
  piover180 = Math.PI / 180;
  margin = {
    top: 20,
    right: 90,
    bottom: 30,
    left: 90
  };
  width = this.ww - this.margin.left - this.margin.right;
  height = this.hh - this.margin.top - this.margin.bottom;
  radius = (Math.min(this.width, this.height) / 2) - 10;
  formatNumber = d3.format('0.2f');
  x = d3.scaleLinear().range([0, 2 * Math.PI]);
  y = d3.scaleLinear().range([0, this.radius]);
  @Input() picdata: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  constructor(private element: ElementRef) { }
  translatehack = (a: number, b: number, r = 0) => `translate(${a},${b}) rotate(${r})`;
  abshack = (q: number) => Math.abs(q);

  ngOnChanges() {
    console.log('changes');
    this.init();
    this.update();
  }
  init() {
    this.ww = 960;
    this.hh = 500;
    this.margin = {
      top: 20,
      right: 90,
      bottom: 30,
      left: 90
    };
    this.width = this.ww - this.margin.left - this.margin.right;
    this.height = this.hh - this.margin.top - this.margin.bottom;
    this.radius = (Math.min(this.width, this.height) / 2) - 10;
    this.x = d3.scaleLinear().range([0, 2 * Math.PI]);
    this.y = d3.scaleLinear().range([0, this.radius]);

    this.colours = d3.scaleLinear<d3.RGBColor>()
      .domain([0, this.picdata.length + 100])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb('white')])
      ;
    this.picdata.forEach(d => {
      this.maxdepth = Math.max(d.depth, this.maxdepth);
    });
  }
  mouser(ee: MouseEvent, i: number, data: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>, inout: true) {
    if (inout) {
      d3.select('app-root').select('div.mainTip')
        .style('opacity', 1)
        .style('display', 'inline-block')
        .style('left', `${ee.pageX}px`)
        .style('top', `${ee.pageY}px`)
        .html(() => (data.parent) ?
          `${data.parent.data.name === '' ? '' : data.parent.data.name + '<br>'}${data.data.name}<br>Value: ${this.formatNumber(data.value)}` :
          `${data.data.name === '' ? 'Total' : data.data.name}<br>Value:${this.formatNumber(data.value)}`);
    } else {
      d3.select('app-root').select('div.mainTip')
        .style('opacity', 0)
        .style('display', 'none');
    }
  }
  clicker(event: MouseEvent, d: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>) {
    const svg = d3.select(event.target as SVGGElement);
    svg.transition().duration(760).ease(d3.easeBack)
      .tween('driller', () => {
        const xd = d3.interpolate(this.x.domain(), [d.x0, d.x1])
          , yd = d3.interpolate(this.y.domain(), [d.y0, 1])
          , yr = d3.interpolate(this.y.range(), [d.y0 ? 10 : 0, this.radius]);
        return (t: number) => {
          this.x.domain(xd(t));
          this.y.domain(yd(t)).range(yr(t));
        };
      })
      .select('path').transition().duration(760)
      .attrTween('d', () => t => this.arcPath(d, t));
    console.log(d.data.name, d.x0, d.x1, d.y0, d.y1);
    console.log(d.x1 - d.x0, this.arcCentroid(d));
  }
  arcCentroid(d: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC.centroid({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, this.y(d.y1)),
      startAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))),
      endAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))),
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  arcPath(d: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>, t = 1) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, t * this.y(d.y1)),
      startAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x0))),
      endAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x1))),
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  boxDiag = (x: number, y: number) => Math.sqrt((x * x + y * y) / 2);
  update() {
    setTimeout(() => {
      d3.select(this.element.nativeElement).selectAll('path#face').data(this.picdata)
        .transition().duration(2000)
        .attrTween('d', d => t => this.arcPath(d, t));
      d3.select(this.element.nativeElement).selectAll('text#face')
        .transition().duration(2000)
        .text((d, i, j) => {
          const boxLength = this.radius / (this.maxdepth + 1) - 4;
          const here = j[i] as SVGTextElement;
          const tLength = here.getComputedTextLength();
          if (tLength > boxLength) {
            const newLen = Math.floor(here.textContent.replace(/ *$/, '').length * (boxLength / tLength));
            const text = here.textContent.substring(0, newLen);
            here.textContent = text;
          }
          return here.textContent;
        });
    });
  }
}
