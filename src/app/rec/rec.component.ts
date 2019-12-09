import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rec',
  templateUrl: './rec.component.html',
  styleUrls: ['./rec.component.css']
})
export class RecComponent implements OnInit {
  inputText = '';
  constructor() { }

  ngOnInit() {
    console.log('init');
  }
  clicker = () => {
    this.inputText = 'clicked';
    const g = d3.select('#RECEIVER').select('g');
    g.attr('transform', this.translatehack(264.5, 90));
  }
  translatehack = (R: number, r: number) => `translate(${R * Math.sin(r / 180 * Math.PI)},${R * Math.cos(r / 180 * Math.PI)}) rotate(${r})`;
  update() {
  }
}
