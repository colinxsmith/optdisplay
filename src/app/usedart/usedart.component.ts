import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-usedart',
  templateUrl: './usedart.component.html',
  styleUrls: ['./usedart.component.css']
})
export class UsedartComponent implements OnInit {
  scale = 1000;
  scl = 0.01;
  root3 = Math.sqrt(3);
  received = 5;
  colourgamma = 1;
  setColour = 'orange';
  constructor(private element: ElementRef) { }
  formatC = (i: number) => d3.format('0.2f')(i);
  ttt = (i: number) => `M${i / 2} 0L${i} ${i / 2 * this.root3}L0 ${i / 2 * this.root3}Z`;
  ngOnInit() {
    this.colourgamma = +(d3.select('#slide').node() as HTMLInputElement).value / 10000;
    setTimeout(() => {
      this.update();
    });
  }
  newgamma(ev: MouseEvent) {
    this.colourgamma = +(ev.target as HTMLInputElement).value / 10000;
    this.update();
  }
  update() {
    d3.select('app-dartboard').style('--back', this.setColour);
    d3.select('app-dartboard').attr('smallgreytitle', this.setColour);
  }
  pick3d(ev: MouseEvent) {
    const dim = +d3.select('#picker').attr('width');
    const root = (d3.select('app-root').node() as HTMLElement).getBoundingClientRect();
    const origin = (d3.select(this.element.nativeElement).node() as HTMLElement).getBoundingClientRect();
    const X = ev.pageX - origin.left;
    const Y = ev.pageY - origin.top - root.top;
    const GB = d3.scaleLinear<d3.RGBColor>()
      .domain([0, dim])
      .interpolate(d3.interpolateRgb.gamma(1.0))
      .range([d3.rgb(0, 255, 0), d3.rgb(0, 0, 255)])
      ;
    const RG = d3.scaleLinear<d3.RGBColor>()
      .domain([0, dim])
      .interpolate(d3.interpolateRgb.gamma(1.0))
      .range([d3.rgb(255, 0, 0), d3.rgb(GB(X))])
      ;
    this.setColour = RG(Y/this.root3*2);
    this.update();
  }
}
