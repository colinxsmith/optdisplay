import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
interface FACDATA { bad: number; poor: number; mediocre: number; average: number; good: number; excellent: number; 'no data': number; }
@Component({
  selector: 'app-exposures',
  templateUrl: './exposures.component.html',
  styleUrls: ['./exposures.component.css']
})
export class ExposuresComponent implements OnInit {
  @Input() DATA: { factorname: string, factordata: FACDATA }[];
  @Input() FACNAMES = ['Pollution Prevention', 'Environmental Transparency', 'Resource Efficiency', 'Compensation & Satisfaction', 'Diversity & Flights', 'Education & Work Conditions', 'Community & Charity', 'Human Rights', 'Sustainability Integration', 'Board Effectiveness', 'Management Ethics', 'Disclosure & Accountability'];
  @Input() ESGscores = ['E2.4', 'S1.6', 'G3.4'];
  @Input() portFolioType = 'Current';
  keys: string[];
  @Input() ww = 500;
  @Input() hh = 500;
  @Input() top = 50;
  @Input() bottom = 150;
  @Input() right = 0;
  @Input() left = 230;
  @Input() labelleft = true;
  xScale = d3.scaleBand();
  yScale = d3.scaleLinear();
  rScale = d3.scaleLinear();
  esgScale = d3.scaleLinear();
  constructor(private element: ElementRef) { }
  translatehack = (x: number, y: number, r = 0) => `translate(${x},${y}) rotate(${r})`;
  ngOnInit() {
    let dMax = 0;
    this.DATA = [];
    this.FACNAMES.forEach(d => {
      const dd: {
        factorname: string;
        factordata: FACDATA;
      } = {
        factorname: d,
        factordata: {
          bad: Math.random(),
          poor: Math.random(),
          mediocre: Math.random(),
          average: Math.random(),
          good: Math.random(),
          excellent: Math.random(),
          'no data': Math.random() * 8 < 1 ? -Math.random() : Math.random()
        }
      };
      this.keys = Object.keys(dd.factordata);
      dMax = Math.max(dMax, d3.max(this.keys.map(kk => Math.abs(dd.factordata[kk]))));
      this.DATA.push(dd);
    });
    this.yScale
      .domain([0, this.FACNAMES.length])
      .range([this.top + (this.hh - this.top - this.bottom) / this.FACNAMES.length,
      this.hh - this.bottom]);
    this.xScale
      .domain(this.keys)
      .range([this.left + (this.ww - this.left - this.right) / this.keys.length,
      this.ww - this.right]);
    this.rScale.domain([0, dMax]).range([0, (this.ww - this.left - this.right) / (this.DATA.length + 1)]);
    this.esgScale
      .domain([0, 3])
      .range([this.left, this.ww - this.right]);
      setTimeout(() => {
        this.update();
      });
  }
  update() {
    const circle = d3.select(this.element.nativeElement).selectAll('circle.exposed');
    circle
      .each((d, i, j) => {
        d3.select(j[i] as SVGCircleElement)
          .transition().duration(1000)
          .attrTween('cy', () => t => `${this.yScale((1 - t) * this.FACNAMES.length / 2 + Math.floor(t * i / this.keys.length))}`);
      });
  }
}
