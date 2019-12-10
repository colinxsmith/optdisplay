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
  }
  ngOnChanges() {
    console.log('changes');
  }
  clicker = (ang: number) => {
    this.inputText = ang === 0 ? '' : 'clicked';
    const g = d3.select('#RECEIVER').select('g');
    g.attr('transform', `translate(400,400) rotate(${ang})`);
  }
  translatehack = (R: number, r: number) => `translate(${R * Math.sin(r / 180 * Math.PI)},${R * Math.cos(r / 180 * Math.PI)}) rotate(${r})`;
  update() {
  }
}
