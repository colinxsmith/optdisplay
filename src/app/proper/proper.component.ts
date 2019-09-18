import { Component, OnInit, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
@Component({
  selector: 'app-proper',
  templateUrl: './proper.component.html',
  styleUrls: ['./proper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProperComponent implements OnInit, AfterViewInit {
  DATA: { x: number }[];
  animateArray: number[] = Array(100);
  w: number;
  h: number;
  scaleX: d3.ScaleLinear<number, number>;
  BARS: d3.Selection<SVGGElement, {
    x: number;
  }, d3.BaseType, unknown>;
  constructor(private mainElement: ElementRef) { }
  ngOnInit() {
    for (let i = 0; i < this.animateArray.length; ++i) {
      this.animateArray[i] = i / (this.animateArray.length - 1);
    }
    console.log('init');
    this.DATA = [];
    for (let i = 0; i < 100; ++i) {
      this.DATA.push({ x: ((i + 1) - 50.5) * ((i + 1) - 40.5) * ((i + 1) - 30.5) });
    }
    this.w = Math.max(this.mainElement.nativeElement.offsetWidth,
      +d3.select(this.mainElement.nativeElement).select('#proper').attr('width'));
    this.h = Math.max(+d3.select(this.mainElement.nativeElement).select('#proper').attr('height'),
      this.mainElement.nativeElement.offsetHeight);
    this.scaleX = d3.scaleLinear().domain([d3.min(this.DATA.map(d => d.x)), d3.max(this.DATA.map(d => d.x))]).range([0, this.w]);
  }
  ngAfterViewInit() {// Add animations to the proper Angular chart
    const test = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    if (test !== undefined) {
      test.data(this.DATA);
      test.transition().duration(1000)
        .attrTween('x', (d: {
          x: number;
        }) => {
          return (t: number) => d.x > 0 ? '' + this.scaleX(0) : '' + this.scaleX(t * d.x);
        })
        .attrTween('width', (d: {
          x: number;
        }) => {
          return (t: number) => d.x < 0 ? '' + (this.scaleX(0) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(0));
        })
        ;
    }
  }

  clicked(DA: { x: number }, i: number) {
    d3.select(this.mainElement.nativeElement).selectAll('#remove').nodes().forEach(d => {
      d3.select((d as SVGRectElement).parentNode).remove();
    });
    const BARS: d3.Selection<SVGRectElement, { x: number }, d3.BaseType, unknown>
      = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    BARS.data(this.DATA);
    d3.select((BARS.nodes()[i] as SVGRectElement)).transition().duration(1000)
      .attrTween('x', (d: {
        x: number;
      }) => {
        return (t: number) => d.x > 0 ? '' + this.scaleX(0) : '' + this.scaleX(t * d.x);
      })
      .attrTween('width', (d: {
        x: number;
      }) => {
        return (t: number) => d.x < 0 ? '' + (this.scaleX(0) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(0));
      });
    (BARS.nodes()[i] as SVGRectElement)
      .setAttribute('style', 'fill:' + (DA.x > 0 ? 'blue' : 'orange'));
  }
}
