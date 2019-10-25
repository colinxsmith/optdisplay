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
  getKeys = Object.keys;
  keys: string[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  radScale: d3.ScaleLinear<number, number>;
  zScale: d3.ScaleLinear<number, d3.RGBColor>;
  isNumberHack = isNumber;
  absHack = Math.abs;
  constructor(private element: ElementRef) {
  }
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
    console.log(dm, dM);
    this.zScale = d3.scaleLinear<number, d3.RGBColor>().domain([dm, dM])
      .range([d3.rgb('red'), d3.rgb('blue')]);
    this.radScale = d3.scaleSqrt().domain([am, aM]).range([0, this.yScale(0.5)]);
  }
  update() {
    this.fontSize = +d3.select(this.element.nativeElement).select('#BUBBLE').select('.table').style('font-size').replace('px', '');
  }
}
