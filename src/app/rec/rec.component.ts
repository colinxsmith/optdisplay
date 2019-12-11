import { Component, OnInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rec',
  templateUrl: './rec.component.html',
  styleUrls: ['./rec.component.css']
})
export class RecComponent implements OnInit, OnChanges {
  inputText = '';
  ww = 100;
  fontSize = 25;
  clickAngle = 720;
  clickedMessage = 'clicked';
  translatehack = (x: number, y: number, theta = 0) => `translate(${x},${y}) rotate(${theta})`;
  constructor() { }

  ngOnInit() {
    console.log('init');
    this.setup();
    setTimeout(() => this.update());
  }
  ngOnChanges() {
    console.log('changes');
    this.setup();
    setTimeout(() => this.update());
  }
  clicker(ang: number, j: number) {
    this.inputText = ang === 0 ? '' : this.clickedMessage;
    const g = d3.select(d3.select('app-rec').select('#RECEIVER').selectAll('g').nodes()[j] as SVGGElement);
    const transF = g.attr('transform').replace(/rotate.*/, '');
    g.transition().duration(2000).ease(d3.easeBounce)
      .styleTween('fill-opacity', () => t => `${t}`)
      .attrTween('transform', () => t => `${transF} rotate(${t * ang})`);
    setTimeout(() => {
      const text = d3.select('app-rec').select('#RECEIVER').selectAll('text').nodes() as Array<SVGTextPathElement>;
      console.log(text[j].getBoundingClientRect(), text[j].getBBox());
    });
  }
  update() {
    console.log('update');
    const ang = 135;
    d3.select('app-rec').select('#RECEIVER').selectAll('g')
      .each((d, i, j) => {
        const g = d3.select(j[i] as SVGGElement);
        const transF = g.attr('transform').replace(/rotate.*/, '');
        g.transition().duration(2000).ease(d3.easeBounce)
          .styleTween('fill-opacity', () => t => `${t}`)
          .attrTween('transform', () => t => `${transF} rotate(${t * ang})`);
      });
    const text = d3.select('app-rec').select('#RECEIVER').selectAll('text').nodes() as SVGTextPathElement[];
    text.forEach(d => console.log(d.getBoundingClientRect(), d.getBBox()));
  }
  setup() {
    const fontHere = d3.select('app-rec').select('#RECEIVER');
    this.fontSize = parseFloat(fontHere.style('font-size')) * 2;
    this.ww = this.fontSize * 10;
    fontHere.style('font-size', `${this.fontSize}px`);
  }
}
