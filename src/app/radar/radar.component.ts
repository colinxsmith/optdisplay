import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

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
      colour: 'red',
      port: [
        { axis: 'one', value: 0.2 }, { axis: 'two', value: -0.2 },
        { axis: 'three', value: 0.7 }, { axis: 'four', value: -0.1 }, { axis: 'five', value: -0.5 }, { axis: 'six', value: -0.1 }
      ]
    },
    {
      colour: 'green',
      port: [
        { axis: 'one', value: 0.5 }, { axis: 'two', value: -0.5 },
        { axis: 'three', value: -0.1 }, { axis: 'four', value: 0.7 }, { axis: 'five', value: -0.5 }, { axis: 'six', value: -0.1 }
      ]
    },
    {
      colour: 'grey',
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
  blobChooser = (k: number) => `M${this.radius * 0.75},${-this.radius * 0.95 + (k - 0.75) * this.squareSize}l${this.squareSize},0,l0,${this.squareSize},l-${this.squareSize},0z`;
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
    this.pMax = Math.max(1, d3.max(this.portfolios[0].port, d => d.value));
    this.pMin = d3.min(this.portfolios[0].port, d => d.value);
    if (this.pMin > 0) {
      this.pMin = 0;
    } else {
      this.pMin = Math.min(-1, this.pMin);
    }
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
  }
  areaChoose(inout: boolean, i: number) {
    const here = d3.select(d3.select(this.element.nativeElement).select('svg').selectAll('path.radarArea').nodes()[i] as SVGPathElement);
    here.transition().duration(200).style('fill-opacity', inout ? 1 : 0.35);
  }
}
