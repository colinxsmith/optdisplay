import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { rgb } from 'd3';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css']
})
export class RadarComponent implements OnInit, OnChanges {

  @Input() R = 900;
  @Input() dR = 100;
  @Input() labelLength = 6; // Axis label max length in multiples of squaresize
  @Input() levels = 3; // Approximate number of value labels (twice this if negative data)
  @Input() curved = true;
  @Input() portfolios: {
    name: string;
    colour: string;
    port: {
      axis: string;
      value: number;
    }[];
  }[] = [
      {
        name: 'Current',
        colour: 'rgb(255, 50, 50)',
        port: [
          { axis: 'one two three four five six', value: 0.2 }, { axis: 'two two three four five six', value: -0.2 },
          { axis: 'three two three four five six', value: 0.7 },
          { axis: 'four two three four five six', value: -0.1 }, { axis: 'five two three four five six', value: -0.5 },
          { axis: 'six seven eight nine ten', value: -0.1 }
        ]
      },
      {
        name: 'Proposed',
        colour: 'rgb(50, 190, 50)',
        port: [
          { axis: 'one two three four five six', value: 0.5 }, { axis: 'two two three four five six', value: -0.5 },
          { axis: 'three two three four five six', value: -0.1 },
          { axis: 'four two three four five six', value: 0.7 }, { axis: 'five two three four five six', value: -0.5 },
          { axis: 'six seven eight nine ten', value: -0.1 }
        ]
      },
      {
        name: 'Target',
        colour: 'rgb(128, 128, 128)',
        port: [
          { axis: 'one two three four five six', value: -0.2 }, { axis: 'two two three four five six', value: 0.2 },
          { axis: 'three two three four five six', value: 0.7 },
          { axis: 'four two three four five six', value: -0.1 }, { axis: 'five two three four five six', value: -0.3 },
          { axis: 'six seven eight nine ten', value: -0.3 }
        ]
      }];
  wraplength = 100;
  assetNamesFontScale = 0.95;
  radius = this.R / 2 - this.dR;
  squareSize = this.radius / 10;
  pMin: number;
  pMax: number;
  PI = Math.PI;
  durationTime = 2000;
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
    this.picture();
    setTimeout(() => this.update());
  }
  ngOnChanges() {
    this.picture();
    setTimeout(() => this.update());
  }
  translatehack = (w: number, h: number) => `translate(${w},${h})`;
  toPxhack = (k: number) => `${k}px`;
  picture() {
    d3.select(this.element.nativeElement).style('font-size', `${this.squareSize}px`);
    // this.squareSize = parseFloat(d3.select(this.element.nativeElement).style('font-size'));
    d3.select(this.element.nativeElement).attr('smallgreytitle', 'Radar');
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
      .curve(this.curved ? d3.curveCatmullRomClosed : d3.curveLinearClosed)
      .radius(d => this.rScale(d.value))
      .angle((d, i) => this.angleScale(i));
    this.radarLineZ
      .curve(d3.curveCatmullRomClosed) // Always curved; we want it to follow the zero circular grid
      .radius(d => this.rScale(0))
      .angle((d, i) => this.angleScale(-i));
  }
  update() {
    d3.select(this.element.nativeElement).select('svg').selectAll('path.radarStroke')
      .transition().duration(this.durationTime).styleTween('stroke-width', () => t => `${4 * t}px`);
    d3.select(this.element.nativeElement).select('svg').selectAll('text.axislabels').transition().duration(this.durationTime)
      .styleTween('font-size', () => t => `${t * this.squareSize * 0.4}px`);
    d3.select(this.element.nativeElement).select('svg.radar').selectAll('text.assetnames').transition().duration(this.durationTime)
      .styleTween('font-size', () => t => `${t * this.squareSize * this.assetNamesFontScale}px`)
      .styleTween('visibility', () => t => t > 0.05 ? 'visible' : 'hidden');
    const leg = d3.select(this.element.nativeElement).select('svg.radar').select('text.assetnames').node() as SVGTextElement;
    if (leg !== null) {
      this.wraplength = leg.textContent.length / leg.getBoundingClientRect().width * this.labelLength * this.squareSize
        / this.assetNamesFontScale;
    }
    d3.select(this.element.nativeElement).select('svg').selectAll('line.line').transition().duration(this.durationTime).ease(d3.easeBounce)
      .tween('line', (d, i, j: Array<SVGLineElement>) => t => {
        const here = d3.select(j[i]);
        here.attr('x2', t * this.rScale(this.pMax * 1.13) * this.cCos(this.angleScale(i) - this.PI / 2));
        here.attr('y2', t * this.rScale(this.pMax * 1.13) * this.cSin(this.angleScale(i) - this.PI / 2));
        here.style('stroke-opacity', t);
        here.style('stroke-width', `${t * 2}px`);
      });
    if (this.pMin < 0) {
      d3.select(this.element.nativeElement).select('svg').select('path.gridZero').transition().duration(this.durationTime)
        .attrTween('d', () => t => {
          return this.arcZ(t);
        });
    }
    d3.select(this.element.nativeElement).select('svg').selectAll('circle.radarCircle')
      .style('fill-opacity', 0.5);
    d3.select(this.element.nativeElement).select('svg').selectAll('circle.radarInvisibleCircle')
      .style('fill-opacity', 0);
  }
  areaChoose(inout: boolean, i: number) {
    d3.select(this.element.nativeElement).select('svg').selectAll('path.radarArea')
      .style('fill-opacity', inout ? 0.1 : 0.35);
    d3.select(this.element.nativeElement).select('svg').selectAll('text.portfoliolabels')
      .style('fill-opacity', inout ? 0.1 : 0.35);
    d3.select(this.element.nativeElement).select('svg').selectAll('path.radarStroke')
      .style('stroke-opacity', inout ? 0.1 : 1);
    d3.select(this.element.nativeElement).select('svg').selectAll('circle.radarCircle')
      .style('fill-opacity', inout ? 0.1 : 1);
    if (inout) {
      const here = d3.select(d3.select(this.element.nativeElement).select('svg').selectAll('path.radarArea').nodes()[i] as SVGPathElement);
      here.transition().duration(inout ? 2 : 10).style('fill-opacity', inout ? 0.7 : 0.35);
      const text = d3.select(d3.select(here.node().parentNode).selectAll('text.portfoliolabels').nodes()[i] as SVGTextElement);
      text.transition().duration(inout ? 2 : 10).style('fill-opacity', inout ? 0.7 : 0.35);
      const stroke = d3.select(d3.select(here.node().parentNode).selectAll('path.radarStroke').nodes()[i] as SVGPathElement);
      stroke.transition().duration(inout ? 2 : 10).style('stroke-opacity', inout ? 1 : 0.35);
    }
    const circles = d3.select(this.element.nativeElement).select('svg')
      .selectAll(`circle#i${i}.radarCircle`);
    circles.each((d, ii, jj: Array<SVGCircleElement>) => {
      const circle = d3.select(jj[ii]);
      circle.transition().duration(inout ? 2 : 10).style('fill-opacity', inout ? 1 : 0.5);
    });

  }
  wrapLabels = (labS: string[], mW: number) => {
    console.log('wrapLabels', mW);
    const labA: string[][] = [];
    if (labS.length > 0) {
      labS.forEach((d, i) => {
        labA.push(this.wrapString(d, mW));
      });
    }
    return labA;
  }
  wrapString = (d: string, mW: number) => {
    const newd: string[] = [];
    let word = '';
    let line = '';
    const words = d.split(' ').reverse();
    while (word = words.pop()) {
      if (line.length + word.length > mW) {
        newd.push(line);
        //       console.log(line, line.length, mW);
        line = '';
      }
      line += word;
      line += ' ';
      //    console.log(line, line.length, mW);
    }
    if (line.length) {
      newd.push(line.substring(0, mW));
    }
    return newd;
  }
  circleChoose(inout: boolean, asset: {
    axis: string;
    value: number;
  }, ee: MouseEvent, i: number, colour = 'grey') {
    const ww = ee.x;
    const hh = (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().height - ee.y;
    if (inout) {
      d3.select(this.element.nativeElement).style('--xx', `${ww - 30}px`);
      d3.select(this.element.nativeElement).style('--yy', `${hh + 100}px`);
    } else {
      d3.select(this.element.nativeElement).style('--xx', '0%');
      d3.select(this.element.nativeElement).style('--yy', 'unset');
    }
    d3.select(this.element.nativeElement).style('--back', colour);
    d3.select(this.element.nativeElement).style('--ff', '55%');
    d3.select(this.element.nativeElement).attr('smallgreytitle', inout ? `${this.percentFormat(asset.value)} ` : 'Radar');
    d3.select(this.element.nativeElement).attr('title', inout ? `${asset.axis} ${this.percentFormat(asset.value)} ` : '');
    d3.select(d3.select(this.element.nativeElement).select('svg.radar').selectAll('text.assetnames').nodes()[i] as SVGTextElement).classed('big', inout);
  }
}
