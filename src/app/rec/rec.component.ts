import { Component, OnInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rec',
  templateUrl: './rec.component.html',
  styleUrls: ['./rec.component.css']
})
export class RecComponent implements OnInit, OnChanges {
  inputText = '';
  constructor() { }

  ngOnInit() {
    console.log('init');
    this.update();
  }
  ngOnChanges() {
    console.log('changes');
    this.update();
  }
  clicker = (ang: number) => {
    this.inputText = ang === 0 ? '' : 'clicked';
    const g = d3.select('app-rec').select('#RECEIVER').select('g');
    g.transition().duration(2000).ease(d3.easeBounce)
      .styleTween('fill-opacity', () => t => `${t}`)
      .attrTween('transform', () => t => `translate(400,400) rotate(${t * ang})`);
  }
  translatehack = (R: number, r: number) => `translate(${R * Math.sin(r / 180 * Math.PI)},${R * Math.cos(r / 180 * Math.PI)}) rotate(${r})`;
  update() {
    const g = d3.select('app-rec').select('#RECEIVER').select('g'), ang = 135;
    g.transition().duration(2000).ease(d3.easeBounce)
      .styleTween('fill-opacity', () => t => `${t}`)
      .attrTween('transform', () => t => `translate(400,400) rotate(${t * ang})`);
  }
}
