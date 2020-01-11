import { Component, OnInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rec',
  templateUrl: './rec.component.html',
  styleUrls: ['./rec.component.css']
})
export class RecComponent implements OnInit, OnChanges {
  title = 'RECEIVER';
  inputText = '';
  ww = 100;
  fontSize = 25;
  clickAngle = 720;
  clickedMessage = 'clicked';
  heightOveFontSize = '1';
  wArray = (ww: number) => [ww, ww * 3, ww * 2, ww * 5, ww * 6, ww * 4, ww * 7];
  trans = (p: number) => this.ww / 2 + p * 2e-1;
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
    const text = d3.select('app-rec').select('#RECEIVER').select('text').node() as SVGTextPathElement;
    this.heightOveFontSize = text.getBBox().height / parseFloat(d3.select(text).style('font-size')) + 'em';
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
    const text = d3.select('app-rec').select('#RECEIVER').selectAll('text').nodes() as Array<SVGTextPathElement>;
    this.heightOveFontSize = text[0].getBBox().height / parseFloat(d3.select(text[0]).style('font-size')) + 'em';
    const rect = d3.select('app-rec').select('#RECEIVER').selectAll('rect').nodes() as Array<SVGRectElement>;
    rect.forEach(d => {
      d3.select(d)
        .attr('height', this.heightOveFontSize);
    });
  }
  setup() {
    if (d3.select('app-rec').attr('data-myattr') === null) {
      d3.select('app-rec').attr('data-myattr', this.title);
    }
    const fontHere = d3.select('app-rec').select('#RECEIVER');
    this.fontSize = parseFloat(fontHere.style('font-size'));
    this.ww = this.fontSize * 10;
    fontHere.style('font-size', `${this.fontSize}px`);
  }
}
