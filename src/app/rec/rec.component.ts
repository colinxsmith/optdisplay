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
    setTimeout(() => this.update());
  }
  clicker = () => {
    this.inputText = 'clicked';
    setTimeout(() => this.update());
  }
  translatehack = (x: number, y: number, r = 0) => `translate(${x},${y}) rotate(${r})`;
  update() {
    const rect = d3.select('#RECEIVER').select('rect');
    console.log('RECT', rect.attr('width'), rect.attr('height'));
    const text = d3.select('#RECEIVER').select('text');
    console.log('TEXT', text.attr('x'), text.attr('y'));
  }
}
