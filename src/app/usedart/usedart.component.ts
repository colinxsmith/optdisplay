import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-usedart',
  templateUrl: './usedart.component.html',
  styleUrls: ['./usedart.component.css']
})
export class UsedartComponent implements OnInit {
  scale = 1000;
  scl = 0.01;
  colourScale: d3.ScaleLinear<d3.RGBColor, string>;
  topcolour = 'orange';
  bottomcolour = 'green';
  received = 5;
  colourgamma = 0.5;
  constructor() { }
  formatC = (i: number) => d3.format('0.2f')(i);
  ngOnInit() {
    this.colourgamma = +(d3.select('#slide').node() as HTMLInputElement).value / 1000;
    setTimeout(() => {
      this.update();
    });
  }
  newcolour(ev: MouseEvent) {
    this.received = +(ev.target as HTMLInputElement).value * this.scl;
    d3.select('app-dartboard').style('--back', this.colourScale(this.received));
    this.update();
  }
  newgamma(ev: MouseEvent) {
    this.colourgamma = +(ev.target as HTMLInputElement).value / 1000;
    this.update();
  }
  getTopcolour(ev: MouseEvent) {
    this.topcolour = (ev.target as HTMLInputElement).value;
    this.update();
  }
  getBottomcolour(ev: MouseEvent) {
    this.bottomcolour = (ev.target as HTMLInputElement).value;
    this.update();
  }
  update() {
    this.colourScale = d3.scaleLinear<d3.RGBColor>()
      .domain([0, 10])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb(this.bottomcolour)])
      ;
    d3.select('app-dartboard').style('--back', this.colourScale(this.received));
  }
}
