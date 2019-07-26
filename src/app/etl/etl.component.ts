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
  stockWeights: number[] = [];
  constructor(private dataService: DataService, private mainScreen: ElementRef) { }

  ngOnInit() {
    this.chooser();
  }
  chooser() {
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('div').remove();
    this.dataService.sendData('etl', { names: this.stockNames, lower: this.stockLower, upper: this.stockUpper }).subscribe(d => {
      console.log(d);
      this.stockNames = d.names;
      this.stockLower = d.lower;
      this.stockUpper = d.upper;
      this.stockWeights = d.weights;
      if (this.stockNames === undefined || this.stockNames.length === 0) {
        for (let i = 0; i < 10; i++) {
          this.stockNames.push(`asset${i}`);
        }
      }
      if (this.stockLower === undefined) {
        this.stockLower = [];
        for (let i = 0; i < this.stockNames.length; i++) {
          this.stockLower.push(0);
        }
      }
      if (this.stockUpper === undefined) {
        this.stockUpper = [];
        for (let i = 0; i < this.stockNames.length; i++) {
          this.stockUpper.push(1);
        }
      }
      const tableFormat = (i: number | string) =>
        isString(i as string) ? i as string : d3.format('0.5f')(i as number);
      const ww = 900, cols = 4, xPos = d3.scaleLinear().domain([0, cols + 1]).range([0, ww]),
        colourT = d3.interpolate(d3.rgb('green'), d3.rgb('blue'));
      const hh = 20 * this.stockNames.length, yPos = d3.scaleLinear().domain([0, this.stockNames.length]).range([0, hh]);
      d3.select(this.mainScreen.nativeElement).select('#stockdata').append('div').attr('class', 'inputData')
        .append('svg')
        .attr('width', ww)
        .attr('height', hh)
        .selectAll('.bounds')
        .data(this.stockNames).enter()
        .append('text')
        .call(d => d.each((dd, i, j) => {
          const here = d3.select(j[i]);
          for (let kk = 0; kk < cols; ++kk) {
            let out: number | string = dd;
            if (kk === 1) {
              out = this.stockLower[i];
            } else if (kk === 2) {
              out = this.stockUpper[i];
            } else if (kk === 3) {
              out = this.stockWeights.length ? this.stockWeights[i] : '';
            } else if (kk === 0) {
              out = this.stockNames[i];
            }
            const t = (kk + 1) / cols;
            here.append('tspan')
              .attr('x', xPos(kk + 1))
              .attr('y', yPos(i + 1))
              .attr('class', 'spacer')
              .style('fill', `${colourT(t)}`)
              .text(tableFormat(out));
          }
        }));
      d3.selectAll('tspan')
        .on('click', (d, i, j) => {
          const id = i % cols;
          const stock = Math.floor(i / cols);
          console.log(i, id, stock);
          const here = (j[i] as SVGTSpanElement);
          const field = d3.select(this.mainScreen.nativeElement).select('#stockdata').append('input');
          field.attr('x', here.getAttribute('x'));
          field.attr('y', here.getAttribute('y'));
          field.text(here.textContent);
          field.on('change', (dd, ii, jj) => {
            const val = +jj[ii].value;
            console.log(val);
            if (id === 1) {
              this.stockLower[stock] = val;
              here.textContent = `${val}`;
            } else if (id === 2) {
              this.stockUpper[stock] = val;
              here.textContent = `${val}`;
            }
            this.chooser();
            field.remove();
          });
        });
    });
  }
}
