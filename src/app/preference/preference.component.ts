import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  @Input() ww = 500;
  @Input() hh = 200;
  @Input() top = 20;
  @Input() bottom = 50;
  @Input() left = 100;
  @Input() right = 10;
  @Input() DATA = [
    { name: 'FACTOR1', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR2', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR3', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR4', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR5', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR6', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR7', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR8', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR9', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR10', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR11', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR12', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR13', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() },
    { name: 'FACTOR14', restricting: Math.random(), below: Math.random(), above: Math.random(), nodata: Math.random() }
  ];
  bw: number;
  scaleY = d3.scaleLinear().domain([0, 1]);
  scaleYR = d3.scaleLinear().domain([0, 1]);
  scaleX = d3.scaleBand();
  constructor(private element: ElementRef) { }
  translatehack = (x: number, y: number, r = 0) => `translate(${x},${y}) rotate(${r})`;
  ngOnInit() {
    const domain: string[] = [];
    this.DATA.forEach((d, i) => {
      domain.push(d.name);
      const total = d.below + d.above + d.nodata;
      this.DATA[i] = {
        name: d.name,
        restricting: d.restricting,
        below: d.below / total,
        above: d.above / total,
        nodata: d.nodata / total
      };
    });
    console.log(this.DATA.map(d => d.below));
    this.scaleX.domain(domain);
    this.bw = (this.ww - this.right - this.left) / (this.DATA.length + 1);
    this.scaleY.range([0, this.hh - this.bottom - this.top]);
    this.scaleYR.range([0, this.bottom / 2]);
    this.scaleX.range([0, this.ww - this.right - this.left]);
  }
  fname(event: MouseEvent, n: string, inout = false) {
    if (inout) {
      d3.select(this.element.nativeElement).select('.tooltp').style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`).style('display', 'inline-block')
        .html(`Factor Name:<br>${n}`);
    } else {
      d3.select(this.element.nativeElement).select('.tooltp').style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`).style('display', 'none');
    }
  }
}
