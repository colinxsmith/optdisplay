import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css']
})
export class DartboardComponent implements OnChanges {
  colours: d3.ScaleLinear<d3.RGBColor, string>;
  @Input() topcolour = 'red';
  @Input() colourgamma = 0.75;
  ww = 960;
  hh = 500;
  margin = {
    top: 20,
    right: 90,
    bottom: 30,
    left: 90
  };
  width = this.ww - this.margin.left - this.margin.right;
  height = this.hh - this.margin.top - this.margin.bottom;
  radius = (Math.min(this.width, this.height) / 2) - 10;
  formatNumber = d3.format(',d');
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
        .html(`Node:${i}<br>${data.data.name}<br>Index:${data.data.index}<br>Value:${this.formatNumber(data.value)}`);
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
    const svg = d3.select(event.target as SVGPathElement);
    svg.transition().duration(750).ease(d3.easeBack)
      .tween('driller', () => {
        const xd = d3.interpolate(this.x.domain(), [d.x0, d.x1])
          , yd = d3.interpolate(this.y.domain(), [d.y0, 1])
          , yr = d3.interpolate(this.y.range(), [d.y0 ? 10 : 0, this.radius]);
        return (t: number) => {
          this.x.domain(xd(t));
          this.y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll('path').transition().duration(750)
      .attrTween('d', (k: d3.HierarchyRectangularNode<{
        children: any[];
        name: string;
        index: number;
        size: number;
      }>) => t => this.arcPath(k, t));
  }
  arcCentroid(d: d3.HierarchyRectangularNode<unknown>) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC.centroid({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, this.y(d.y1)),
      startAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))),
      endAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))),
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  arcPath(d: d3.HierarchyRectangularNode<unknown>, t = 1) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, t * this.y(d.y1)),
      startAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x0))),
      endAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x1))),
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  update() {
    setTimeout(() => {
      d3.select(this.element.nativeElement).selectAll('path#face').data(this.picdata)
        .transition().duration(2000)
        .attrTween('d', d => t => this.arcPath(d, t));
    });
  }
}
