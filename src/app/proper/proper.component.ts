import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-proper',
  templateUrl: './proper.component.html',
  styleUrls: ['./proper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProperComponent implements OnInit {
  DATA = [{ x: 1, name: 'name1' }, { x: -2, name: 'name2' }, { x: 3, name: 'name3' }];
  w: number;
  h: number;
  scaleX: d3.ScaleLinear<number, number>;
  constructor(private mainElement: ElementRef) { }

  ngOnInit() {
    const SVG = d3.select(this.mainElement.nativeElement).select('#barchart');
    console.log(SVG.attr('width'), SVG.attr('height'));
    this.w = +SVG.attr('width');
    this.h = +SVG.attr('height');
    this.scaleX = d3.scaleLinear().domain([d3.min(this.DATA.map(d => d.x)), d3.max(this.DATA.map(d => d.x))]).range([0, this.w]);
    const BASE = SVG.selectAll('.bars').data(this.DATA).enter().append('g');
    const BARS: d3.Selection<SVGGElement, {
      x: number;
      name: string;
    }, d3.BaseType, unknown>
      = d3.select(this.mainElement.nativeElement).select('svg').selectAll('g');

    BARS.append('rect')
      .attr('x', d => d.x > 0 ? this.scaleX(0) : this.scaleX(d.x))
      .attr('width', d => d.x < 0 ? this.scaleX(0) - this.scaleX(d.x) : this.scaleX(d.x) - this.scaleX(0))
      .attr('y', (d, i) => this.h * i / this.DATA.length)
      .attr('height', this.h / this.DATA.length);

  }
  clicked(DA: { x: number, names: string }, i: number) {
    const PROPERBARs = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    PROPERBARs
      .style('fill', (d, ii) => i === ii ? (DA.x > 0 ? 'blue' : 'red') : '');
  }

}
