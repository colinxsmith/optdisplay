import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { select } from 'd3';
@Component({
  selector: 'app-proper',
  templateUrl: './proper.component.html',
  styleUrls: ['./proper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProperComponent implements OnInit {
  DATA: { x: number }[];
  w: number;
  h: number;
  scaleX: d3.ScaleLinear<number, number>;
  constructor(private mainElement: ElementRef) { }
  ngOnInit() {
    this.DATA = [];
    for (let i = 0; i < 10; ++i) {
      this.DATA.push({ x: ((i + 1) - 5.5) * ((i + 1) - 4.5) * ((i + 1) - 3.5) });
    }
    const SVG = d3.select(this.mainElement.nativeElement).select('#barchart');
    this.w = +SVG.attr('width');
    this.h = +SVG.attr('height');
    this.scaleX = d3.scaleLinear().domain([d3.min(this.DATA.map(d => d.x)), d3.max(this.DATA.map(d => d.x))]).range([0, this.w]);
    SVG.selectAll('.bars').data(this.DATA).enter().append('g');
    const BARS: d3.Selection<SVGGElement, {
      x: number;
    }, d3.BaseType, unknown>
      = d3.select(this.mainElement.nativeElement).select('#barchart').selectAll('g');
    BARS.append('rect')
      .attr('x', d => d.x > 0 ? this.scaleX(0) : this.scaleX(d.x))
      .attr('width', d => d.x < 0 ? this.scaleX(0) - this.scaleX(d.x) : this.scaleX(d.x) - this.scaleX(0))
      .attr('y', (d, i) => this.h * i / this.DATA.length)
      .attr('height', this.h / this.DATA.length)
      .on('click', (d, i, j) => {
        j[i].setAttribute('style', 'fill:' + (d.x > 0 ? 'blue' : 'orange'));
      });
    BARS.selectAll('rect').transition().duration(1000)
      .attrTween('x', (d: { x: number }, i, j) => {
        return (t) => d.x > 0 ? '' + this.scaleX(1 - t) : '' + this.scaleX(t * d.x);
      })
      .attrTween('width', (d: { x: number }) => {
        return (t) => d.x < 0 ? '' + (this.scaleX(1 - t) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(1 - t));
      })
      ;
  }
  clicked(DA: { x: number }, i: number) {
    const BARS = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    (BARS.nodes()[i] as SVGRectElement)
      .setAttribute('style', 'fill:' + (DA.x > 0 ? 'blue' : 'red'));
  }
}
