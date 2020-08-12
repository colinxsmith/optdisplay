import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-pillar3',
  templateUrl: './pillar3.component.html',
  styleUrls: ['./pillar3.component.css']
})
export class Pillar3Component implements OnInit {

  @Input() ww = 500;
  @Input() hh = 500;
  @Input() left = 100;
  @Input() right = 50;
  @Input() top = 15;
  @Input() bottom = 0;
  @Input() nolines = false;
  @Input() pillars = {
    E: [1, 1, 1, 0, 1, 1, 1],
    S: [1, 1, 1, 1, 1, 1, 0],
    G: [1, 1, 4, 1, 1, 1, 1]
  };
  @Input() leftlabel = false;
  ESG: string[];
  plotP: number[][];
  @Input() Classes = ['bad', 'poor', 'mediocre', 'average', 'good', 'excellent', 'nodata'];
  constructor(private element: ElementRef) { }
  scaleX = d3.scaleLinear().domain([0, 3]);
  scaleY = d3.scaleLinear().domain([0, 1]);

  ngOnInit() {
    this.plotP = Array(3);
    this.ESG = Object.keys(this.pillars);
    this.ESG.forEach((pp, j) => {
      const tot = d3.sum(this.pillars[pp]);
      let y = 0;
      this.plotP[j] = [];
      this.plotP[j].push(0);
      this.pillars[pp].forEach((d, i) => {
        y += this.pillars[pp][i] / tot;
        this.plotP[j].push(y);
      });
    });
    this.scaleX.range([this.left, this.ww - this.right]);
    this.scaleY.range([this.hh - this.bottom, this.top]);
    console.log(this.Classes);
    this.update();
  }
  update() {
    setTimeout(() => {
      d3.select(this.element.nativeElement).selectAll('text')
        .transition().duration(5000)
        .attrTween('transform', () => t => `rotate(${(1 - t) * 90})`);
      d3.select(this.element.nativeElement).selectAll('rect')
        .transition().duration(5000)
        .attrTween('width', (d, ij) => t => {
          const i = Math.floor(ij / 7);
          return `${(this.scaleX(i + 1) - this.scaleX(i)) * t}`;
        })
        .attrTween('x', (d, ij) => t => {
          const i = Math.floor(ij / 7);
          return `${(this.scaleX(i)) * t}`;
        })
        .attrTween('height', (d, ij) => t => {
          const i = Math.floor(ij / 7);
          const j = Math.floor(ij % 7);
          return `${t * (this.scaleY(this.plotP[i][j]) - this.scaleY(this.plotP[i][j + 1]))}`;
        })
        .attrTween('y', (d, ij) => t => {
          const i = Math.floor(ij / 7);
          const j = Math.floor(ij % 7);
          return `${t * (this.scaleY(this.plotP[i][j + 1]))}`;
        });
    });
  }
}