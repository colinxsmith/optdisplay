import { Component, OnInit, ElementRef, OnChanges, SimpleChanges, ViewEncapsulation, Input } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
@Component({
  selector: 'app-proper',
  templateUrl: './proper.component.html',
  styleUrls: ['./proper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProperComponent implements OnInit, OnChanges {
  @Input() DATA: { x: number }[];
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
    for (let i = 0; i < 10; ++i) {
      this.DATA.push({ x: ((i + 1) - 5.5) * ((i + 1) - 4.5) * ((i + 1) - 3.5) });
    }
    this.picture();
    /*    this.DATA = [];
        for (let i = 0; i < 10; ++i) {
          this.DATA.push({ x: (-(i + 1) + 5.5) * (-(i + 1) + 4.5) * (-(i + 1) + 3.5) });
        }*/
  }
  ngOnChanges(ch: SimpleChanges) {
    console.log(ch);
    this.picture();
    const test = d3.select(this.mainElement.nativeElement).selectAll('rect');
    console.log(test);
    if (test !== undefined) {
      test.transition().duration(1000)
        .attrTween('x', (d: { x: number }) => {
          console.log(d);
          return (t: number) => d.x > 0 ? '' + this.scaleX(0) : '' + this.scaleX(t * d.x);
        })
        .attrTween('width', (d: { x: number }) => {
          console.log(d);
          return (t: number) => d.x < 0 ? '' + (this.scaleX(0) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(0));
        })
        ;
    }
  }
  picture() {
    const SVG = d3.select(this.mainElement.nativeElement).select('#barchart');
    console.log(this.mainElement.nativeElement.offsetWidth, this.mainElement.nativeElement.offsetHeight);
    this.w = +SVG.attr('width');
    this.h = +SVG.attr('height');
    console.log(this.w, this.h);
    this.scaleX = d3.scaleLinear().domain([d3.min(this.DATA.map(d => d.x)), d3.max(this.DATA.map(d => d.x))]).range([0, this.w]);
    SVG.selectAll('.bars').data(this.DATA).enter().append('g');
    this.BARS = d3.select(this.mainElement.nativeElement).select('#barchart').selectAll('g');
    this.BARS.append('rect')
      .attr('x', d => d.x > 0 ? this.scaleX(0) : this.scaleX(d.x))
      .attr('width', d => d.x < 0 ? this.scaleX(0) - this.scaleX(d.x) : this.scaleX(d.x) - this.scaleX(0))
      .attr('y', (d, i) => this.h * i / this.DATA.length)
      .attr('height', this.h / this.DATA.length)
      .on('click', (d, i, j) => {
        j[i].setAttribute('style', 'fill:' + (d.x > 0 ? 'blue' : 'orange'));
      });
    this.BARS.selectAll('rect').transition().duration(1000)
      .attrTween('x', (d: { x: number }) => {
        return (t: number) => d.x > 0 ? '' + this.scaleX(0) : '' + this.scaleX(t * d.x);
      })
      .attrTween('width', (d: { x: number }) => {
        return (t: number) => d.x < 0 ? '' + (this.scaleX(0) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(0));
      })
      ;
  }
  clicked(DA: { x: number }, i: number) {
    d3.select(this.mainElement.nativeElement).selectAll('#remove').nodes().forEach(d => {
      d3.select((d as SVGRectElement).parentNode).remove();
    });
    const BARS: d3.Selection<SVGRectElement, { x: number }, d3.BaseType, unknown>
      = d3.select(this.mainElement.nativeElement).select('#proper').selectAll('rect');
    d3.select((BARS.nodes()[i] as SVGRectElement)).transition().duration(1000)
      .attrTween('x', () => {
        const d = DA;
        return (t: number) => d.x > 0 ? '' + this.scaleX(0) : '' + this.scaleX(t * d.x);
      })
      .attrTween('width', () => {
        const d = DA;
        return (t: number) => d.x < 0 ? '' + (this.scaleX(0) - this.scaleX(t * d.x)) : '' + (this.scaleX(t * d.x) - this.scaleX(0));
      });
    (BARS.nodes()[i] as SVGRectElement)
      .setAttribute('style', 'fill:' + (DA.x > 0 ? 'blue' : 'red'));
  }
}
