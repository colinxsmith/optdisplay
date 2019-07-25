import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { isString } from 'util';

@Component({
  selector: 'app-etl',
  templateUrl: './etl.component.html',
  styleUrls: ['./etl.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EtlComponent implements OnInit {
  stockNames: string[] = [];
  stockLower: number[] = [];
  stockUpper: number[] = [];
  constructor(private mainScreen: ElementRef) { }

  ngOnInit() {
    this.chooser();
  }
  chooser() {
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('div').remove();
    this.stockNames = [];
    this.stockLower = [];
    this.stockUpper = [];
    for (let i = 0; i < 19; i++) {
      this.stockNames.push(`stock${i}`);
      this.stockLower.push(0);
      this.stockUpper.push(1);
    }
    const tableFormat = (i: number | string) =>
      isString(i as string) ? i as string : d3.format('0.5f')(i as number);
    const ww = 900, xPos = d3.scaleLinear().domain([0, 3]).range([0, ww]);
    const hh = 20 * this.stockNames.length, yPos = d3.scaleLinear().domain([0, this.stockNames.length]).range([0, hh]);
    d3.select(this.mainScreen.nativeElement).select('#stockdata').append('div').attr('class', 'inputData')
      .append('svg')
      .attr('width', ww)
      .attr('height', hh).append('g')
      .selectAll('.bounds')
      .data(this.stockNames).enter()
      .append('g')
      .append('text').text(d => d)
      .call(d => d.each((dd, i, j) => {
        const here = d3.select(j[i]);
        for (let kk = 0; kk < 3; ++kk) {
          let out: number | string = dd;
          if (kk === 1) {
            out = this.stockLower[i];
          } else if (kk === 2) {
            out = this.stockUpper[i];
          }
          const t = (kk + 1) / 3;
          here.append('tspan')
            .attr('x', xPos(kk))
            .attr('y', yPos(i))
            .attr('class', 'spacer')
            .style('fill', `${d3.rgb(200 * (1 - t), t / 2 * 255, 200 * t)}`)
            .text(tableFormat(out));
        }
      }));
    d3.selectAll('tspan')
      .on('click', (d, i, j) => {
        const here = (j[i] as SVGTSpanElement);
        const field = d3.select(this.mainScreen.nativeElement).select('#stockdata').select('div').append('input');
        field.text(here.textContent);
        field.on('change', (d, i, j) => {
          const id = i % 3;
          const stock = Math.floor(i % this.stockNames.length);
          if (id === 1) { this.stockLower[stock] = +j[i].value; }
        });
      });
  }
}
