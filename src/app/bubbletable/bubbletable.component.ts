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
  @Input() paths = true;
  path: string;
  getKeys = Object.keys;
  keys: string[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  radScale: d3.ScaleLinear<number, number>;
  radarLine: d3.LineRadial<number>;
  pathScale: (t: number) => string;
  circleScale: (t: number) => string;
  squareScale: (t: number) => string;
  isNumberHack = isNumber;
  absHack = Math.abs;
  constructor(private element: ElementRef) {
  }
  vertexLine = (t: number) => [2 * t, t, t, t, t, t, 2 * t];
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
      for (let i = 0; i < 10; ++i) {
        this.DATA.push({ name: `name${i + 1}`, x: i, y: i * i, z: i * i * (i - 5.5) });
      }
    }
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
      .radius((d, i) => {
        console.log(d, i);
        return d * (i % 2 + 1) / 2;
      })
      .angle((d, i) => angScale(i));
  }
  update() {
    this.fontSize = +d3.select(this.element.nativeElement).select('#BUBBLE').select('.table').style('font-size').replace('px', '');
  }
  textClick(xpos: number, ypos: number) {
    const here = d3.select(this.element.nativeElement).selectAll('text.table').nodes() as SVGTextElement[];
    const hh = d3.select(here[ypos]).selectAll('tspan').nodes()[xpos] as SVGTSpanElement;
    if (this.isNumberHack(this.DATA[ypos][d3.select(hh).attr('ix')])) {
      console.log(hh.textContent, this.DATA[ypos][d3.select(hh).attr('ix')]);
    }
  }
}
