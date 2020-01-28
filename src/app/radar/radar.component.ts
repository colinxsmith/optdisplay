import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { rgb } from 'd3';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css']
})
export class RadarComponent implements OnInit {

  R = 900;
  dR = 50;
  radius = this.R / 2 - this.dR;
  squareSize = this.radius / 10;
  levels = 3;
  pMin: number;
  pMax: number;
  PI = Math.PI;
  portfolios = [
    {
      name: 'Current',
      colour: rgb(255, 50, 50),
      port: [
        { axis: 'one', value: 0.2 }, { axis: 'two', value: -0.2 },
        { axis: 'three', value: 0.7 }, { axis: 'four', value: -0.1 }, { axis: 'five', value: -0.5 }, { axis: 'six', value: -0.1 }
      ]
    },
    {
      name: 'Proposed',
      colour: rgb(50, 190, 50),
      port: [
        { axis: 'one', value: 0.5 }, { axis: 'two', value: -0.5 },
        { axis: 'three', value: -0.1 }, { axis: 'four', value: 0.7 }, { axis: 'five', value: -0.5 }, { axis: 'six', value: -0.1 }
      ]
    },
    {
      name: 'Target',
      colour: rgb(128, 128, 128),
      port: [
        { axis: 'one', value: -0.2 }, { axis: 'two', value: 0.2 },
        { axis: 'three', value: 0.7 }, { axis: 'four', value: -0.1 }, { axis: 'five', value: -0.3 }, { axis: 'six', value: -0.3 }
      ]
    }];
  constructor(private element: ElementRef) { }
  cCos = Math.cos;
  cSin = Math.sin;
  rScale = d3.scaleLinear<number, number>().range([0, this.radius]);
  circScale = d3.scaleLinear<number, number>().range([0, this.radius]);
  circVal = d3.scaleLinear<number, number>();
  percentFormat = d3.format('.1%');
  angleScale = d3.scaleLinear<number, number>().domain([0, this.portfolios[0].port.length]).range([0, Math.PI * 2]);
  levelsRange: number[];
  radarLine = d3.lineRadial<{ axis: string, value: number }>().curve(d3.curveLinearClosed);
  radarLineZ = d3.lineRadial<{ axis: string, value: number }>().curve(d3.curveLinearClosed);
  blobChooser = (k: number, x: number, y: number) => `M${x},${y + (k - 0.75) * this.squareSize}l${this.squareSize},0,l0,${this.squareSize},l-${this.squareSize},0z`;
  arcZ = (t: number) => d3.arc()({
    innerRadius: this.circScale(this.circVal.invert(0)),
    outerRadius: this.circScale(this.circVal.invert(0)),
    startAngle: 0,
    endAngle: Math.PI * 2 * t,
    padAngle: 0
  })
  ngOnInit() {
    d3.select(this.element.nativeElement).attr('smallgreytitle', 'Radar');
    this.picture();
    setTimeout(() => this.update());
  }
  translatehack = (w: number, h: number) => `translate(${w},${h})`;
  picture() {
    this.pMax = 0;
    this.pMin = 0;
    this.portfolios.forEach(port => {
      this.pMax = Math.max(this.pMax, d3.max(port.port, d => d.value));
      this.pMin = Math.min(this.pMin, d3.min(port.port, d => d.value));
    });
    this.rScale.domain([this.pMin, this.pMax]);
    this.circScale.domain([this.pMin < 0 ? -this.levels : 0, this.levels]);
    this.circVal.range([this.pMin, this.pMax]).domain([this.pMin < 0 ? -this.levels : 0, this.levels]);
    this.levelsRange = d3.range(this.pMin < 0 ? -this.levels : 0, this.levels + 1).reverse();
    this.radarLine
      .curve(d3.curveCatmullRomClosed)
      .radius(d => this.rScale(d.value))
      .angle((d, i) => this.angleScale(i));
    this.radarLineZ
      .curve(d3.curveCatmullRomClosed)
      .radius(d => this.rScale(0))
      .angle((d, i) => this.angleScale(-i));
  }
  update() {
    d3.select(this.element.nativeElement).select('svg').selectAll('line.line').transition().duration(2000).ease(d3.easeBounce)
      .tween('line', (d, i, j: Array<SVGLineElement>) => t => {
        const here = d3.select(j[i]);
        here.attr('x2', t * this.rScale(this.pMax * 1.13) * this.cCos(this.angleScale(i) - this.PI / 2));
        here.attr('y2', t * this.rScale(this.pMax * 1.13) * this.cSin(this.angleScale(i) - this.PI / 2));
        here.style('stroke-opacity', t);
        here.style('stroke-width', `${t * 2}px`);
      });
    d3.select(this.element.nativeElement).select('svg').selectAll('circle.radarInvisibleCircle')
      .style('fill-opacity', 0);
    d3.select(this.element.nativeElement).select('svg').selectAll('circle.radarCircle')
      .style('fill-opacity', 0.5);
  }
  areaChoose(inout: boolean, i: number) {
    d3.select(this.element.nativeElement).select('svg').selectAll('path.radarArea')
      .style('fill-opacity', inout ? 0.05 : 0.35);
    d3.select(this.element.nativeElement).select('svg').selectAll('text.portlabs')
      .style('fill-opacity', inout ? 0.05 : 0.35);
    d3.select(this.element.nativeElement).select('svg').selectAll('path.radarStroke')
      .style('stroke-opacity', inout ? 0.2 : 0.35);
    d3.select(this.element.nativeElement).select('svg').selectAll('circle.radarCircle')
      .style('fill-opacity', inout ? 0.5 : 0.5);
    if (inout) {
      const here = d3.select(d3.select(this.element.nativeElement).select('svg').selectAll('path.radarArea').nodes()[i] as SVGPathElement);
      here.transition().duration(inout ? 2 : 10).style('fill-opacity', inout ? 0.7 : 0.35);
      const text = d3.select(d3.select(here.node().parentNode).selectAll('text.portlabs').nodes()[i] as SVGTextElement);
      text.transition().duration(inout ? 2 : 10).style('fill-opacity', inout ? 0.7 : 0.35);
      const stroke = d3.select(d3.select(here.node().parentNode).selectAll('path.radarStroke').nodes()[i] as SVGPathElement);
      stroke.transition().duration(inout ? 2 : 10).style('stroke-opacity', inout ? 0.7 : 0.35);
    }
    const circles = d3.select(this.element.nativeElement).select('svg')
      .selectAll(`circle#i${i}.radarCircle`);
    circles.each((d, ii, jj: Array<SVGCircleElement>) => {
      const circle = d3.select(jj[ii]);
      circle.transition().duration(inout ? 2 : 10).style('fill-opacity', inout ? 1 : 0.5);
    });

  }
  circleChoose(inout: boolean, n: number, ee: MouseEvent, colour = 'grey') {
    const ww = ee.x;
    const hh = (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().height - ee.y;
    if (inout) {
      d3.select(this.element.nativeElement).style('--xx', `${ww - 30}px`);
      d3.select(this.element.nativeElement).style('--yy', `${hh + 60}px`);
    } else {
      d3.select(this.element.nativeElement).style('--xx', '0%');
      d3.select(this.element.nativeElement).style('--yy', 'unset');
    }
    d3.select(this.element.nativeElement).style('--back', colour);
    d3.select(this.element.nativeElement).style('--ff', '100%');
    d3.select(this.element.nativeElement).attr('smallgreytitle', inout ? `${this.percentFormat(n)}` : 'Radar');
    d3.select(this.element.nativeElement).attr('title', inout ? `${this.percentFormat(n)}` : '');
  }
}
