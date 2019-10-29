import { Component, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { isNumber } from 'util';
@Component({
  selector: 'app-bubbletable',
  templateUrl: './bubbletable.component.html',
  styleUrls: ['./bubbletable.component.css']
})
export class BubbletableComponent implements OnInit, OnChanges {
  @Input() DATA: {}[] = [];
  @Input() width = 800;
  @Input() height = 800;
  @Input() fontSize = 20;
  @Input() circles = true;
  @Input() squares = true;
  @Input() squareRotate = 60;
  @Input() pathRotate = 45;
  @Input() paths = true;
  getKeys = Object.keys;
  keys: string[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  radScale: d3.ScaleLinear<number, number>;
  radarLine: d3.LineRadial<number>;
  dataOrder: number[];
  updateCount = 0;
  pathScale: (t: number) => string;
  circleScale: (t: number) => string;
  squareScale: (t: number) => string;
  isNumberHack = isNumber;
  absHack = Math.abs;
  constructor(private element: ElementRef) {
  }
  vertexLine = (t: number) => [t, t / 3, t, t / 2, t, t / 2, t, t / 3];
  getIdHack = (x: number, y: number) => `${x},${y}`;
  translateHack = (x: number, y: number, r = 0) => `translate(${x},${y}) rotate(${r})`;
  ngOnInit() {
    this.setup();
    setTimeout(() => this.update());
  }
  ngOnChanges() {
    this.setup();
    setTimeout(() => this.update());
  }
  setup() {
    if (!this.DATA.length) {
      for (let i = 0; i < 7; ++i) {
        this.DATA.push({ name: `name${i + 1}`, x: i, y: i * i, z: i * i * (i - 5.5) });
      }
      this.height = this.DATA.length * this.fontSize * 4;
    }
    this.dataOrder = Array(this.DATA.length);
    for (let i = 0; i < this.dataOrder.length; ++i) {
      this.dataOrder[i] = i;
    }
    console.log(this.dataOrder);
    this.keys = this.getKeys(this.DATA[0]);
    this.xScale = d3.scaleLinear().domain([0, this.getKeys(this.DATA[0]).length + 1]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([0, this.DATA.length + 1]).range([0, this.height]);
    let dm = 0, dM = 0, am = 0, aM = 0;
    this.DATA.forEach(d => {
      this.getKeys(d).forEach(dd => {
        if (this.isNumberHack(d[dd])) {
          dm = Math.min(dm, d[dd]);
          dM = Math.max(dM, d[dd]);
          am = Math.min(am, Math.abs(d[dd]));
          aM = Math.max(aM, Math.abs(d[dd]));
        }
      });
    });
    const cScale = d3.scaleLinear().domain([dm, dM]).range([0, 1]);
    this.pathScale = (t: number) => {
      const back = d3.interpolateRgb(d3.rgb('cyan'), d3.rgb('purple'))(cScale(t));
      return back;
    };
    this.circleScale = (t: number) => {
      const back = d3.interpolateRgb(d3.rgb('red'), d3.rgb('blue'))(cScale(t));
      return back;
    };
    this.squareScale = (t: number) => {
      const back = d3.interpolateRgb(d3.rgb('yellow'), d3.rgb('orange'))(cScale(t));
      return back;
    };
    this.radScale = d3.scaleSqrt().domain([am, aM]).range([0, this.yScale(0.5)]);
    const angScale = d3.scaleLinear().domain([0, this.vertexLine(1).length]).range([0, Math.PI * 2]);
    this.radarLine = d3.lineRadial<number>()
      .curve(d3.curveCardinalClosed)
      .radius(d => d)
      .angle((d, i) => angScale(i));
  }
  update() {
    this.updateCount++;
    console.log('update count', this.updateCount);
    this.fontSize = +d3.select(this.element.nativeElement).select('#BUBBLE').select('.table').style('font-size').replace('px', '');
    if (this.circles) {
      const circleTable = d3.select(this.element.nativeElement).selectAll('circle.table').nodes() as SVGCircleElement[];
      circleTable.forEach(d => {
        const here = d3.select(d);
        const ij = here.attr('ij');
        here
          .attr('cx', this.xScale(+ij.split(',')[0] + 1))
          .attr('cy', this.yScale(+ij.split(',')[1] + 1));
        here.transition().duration(2000)
          .tween('ff', (dd, i) => (t) => {
            here.attr('cx', (t * (1 - t) + 1) * this.xScale(+ij.split(',')[0] + 1));
            here.attr('cy', (1 - t) * this.height * 0.95 + t * this.yScale(+ij.split(',')[1] + 1));
          });
      });
    }
    if (this.squares) {
      const squareTable = d3.select(this.element.nativeElement).selectAll('rect.table').nodes() as SVGRectElement[];
      squareTable.forEach(d => {
        const here = d3.select(d);
        const ij = here.attr('ij');
        here.attr('transform', this.translateHack(this.xScale(+ij.split(',')[0] + 1), this.yScale(+ij.split(',')[1] + 1)));
        here.transition().duration(2000)
          .tween('ff', (dd, i) => (t) => {
            here.attr('transform', this.translateHack(this.xScale(+ij.split(',')[0] + 1), t * this.yScale(+ij.split(',')[1] + 1),
              this.squareRotate * t));
          });
      });
    }
    if (this.paths) {
      const pathTable = d3.select(this.element.nativeElement).selectAll('path.table').nodes() as SVGRectElement[];
      pathTable.forEach(d => {
        const here = d3.select(d);
        const ij = here.attr('ij');
        here.attr('transform', this.translateHack(this.xScale(+ij.split(',')[0] + 1), this.yScale(+ij.split(',')[1] + 1)));
        here.transition().duration(2000)
          .tween('ff', (dd, i) => (t) => {
            here.attr('transform', this.translateHack(this.xScale(+ij.split(',')[0] + 1),
              (t * (1 - t) + 1) * this.yScale(+ij.split(',')[1] + 1), this.pathRotate * t));
          });
      });
    }
    const textTable = d3.select(this.element.nativeElement).selectAll('text.table').nodes() as SVGTextElement[];
    textTable.forEach((d, i) => {
      const dd = d3.select(d);
      dd
        .attr('transform', `translate(0,${this.yScale(i + 1) + this.fontSize / 4}) rotate(-45)`)
        .transition().duration(2000)
        .attr('transform', `translate(0,${this.yScale(i + 1) + this.fontSize / 4}) rotate(0)`);
    });
  }
  textClick(xpos: number, ypos: number) {
    const textTable = d3.select(this.element.nativeElement).selectAll('text.table').nodes() as SVGTextElement[];
    const tspanTable = d3.select(textTable[ypos]).selectAll('tspan').nodes()[xpos] as SVGTSpanElement;
    if (this.isNumberHack(this.DATA[ypos][d3.select(tspanTable).attr('ix')])) {
      const key = d3.select(tspanTable).attr('ix');
      console.log(key, tspanTable.textContent, this.DATA[ypos][key]);
      for (let i = 0; i < this.dataOrder.length; ++i) {
        this.dataOrder[i] = i;
      }
      this.dataOrder.sort((d1, d2) => {
        if (this.DATA[d1][key] < this.DATA[d2][key]) {
          return 1;
        } else if (this.DATA[d1][key] === this.DATA[d2][key]) {
          return 0;
        } else {
          return -1;
        }
      });
    } else {
      for (let i = 0; i < this.dataOrder.length; ++i) {
        this.dataOrder[i] = i;
      }
    }
    console.log(this.dataOrder);
    this.update();
  }
}
