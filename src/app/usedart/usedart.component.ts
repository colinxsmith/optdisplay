import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { element } from 'protractor';

@Component({
  selector: 'app-usedart',
  templateUrl: './usedart.component.html',
  styleUrls: ['./usedart.component.css']
})
export class UsedartComponent implements OnInit {
  scale = 1000;
  scl = 0.01;
  colourScale: d3.ScaleLinear<d3.RGBColor, string>;
  topcolour = 'red';
  bottomcolour = 'rgb(200,100,50)';
  received = 5;
  colourgamma = 0.5;
  constructor() { }

  ngOnInit() {
    this.colourgamma = +(d3.select('#slide').node() as HTMLInputElement).value / 1000;
    this.colourScale = d3.scaleLinear<d3.RGBColor>()
      .domain([0, 10])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb(this.bottomcolour)])
      ;
  }
  newcolour(ev: MouseEvent) {
    this.received = +(ev.target as HTMLInputElement).value * this.scl;
  }
  newgamma(ev: MouseEvent) {
    this.colourgamma = +(ev.target as HTMLInputElement).value / 1000;
  }
  getTopcolour(ev: MouseEvent) {
    this.topcolour = (ev.target as HTMLInputElement).value;
    this.colourScale = d3.scaleLinear<d3.RGBColor>()
      .domain([0, 10])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb(this.bottomcolour)])
      ;
  }
  getBottomcolour(ev: MouseEvent) {
    this.bottomcolour = (ev.target as HTMLInputElement).value;
    this.colourScale = d3.scaleLinear<d3.RGBColor>()
      .domain([0, 10])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb(this.bottomcolour)])
      ;
  }
}
