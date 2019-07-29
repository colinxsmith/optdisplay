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
  stockAlpha: number[] = [];
  CVar_averse = 1000;
  Return_gamma = 0;
  ETL: number;
  RISK: number;
  RETURN: number;
  MESSAGE: string;
  cols = 5;
  sendLabel = 'SEND';
  constructor(private dataService: DataService, private mainScreen: ElementRef) { }

  ngOnInit() {
    this.chooser();
  }
  sendData() {
    this.chooser();
  }
  zeroAlpha() {
    for (let i = 0; i < this.stockAlpha.length; ++i) {
      this.stockAlpha[i] = 0;
    }
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
      .nodes().forEach((d, ii, j) => {
        const k = Math.floor(ii / this.cols);
        if (k > 0) {
          if (ii % this.cols === (this.cols - 1)) {
            (j[ii] as SVGTSpanElement).textContent = `${this.stockAlpha[k - 1]}`;
          }
        }
      });
  }
  chooser() {
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('div').remove();
    d3.select(this.mainScreen.nativeElement).select('#valuesback').selectAll('svg').remove();
    d3.select(this.mainScreen.nativeElement).select('#message').selectAll('text').remove();
    this.dataService.sendData('etl', {
      names: this.stockNames, lower: this.stockLower, upper: this.stockUpper, alpha: this.stockAlpha,
      CVar_averse: this.CVar_averse, gamma: this.Return_gamma
    })
      .subscribe(
        (DAT: {
          port: { names: string, lower: number, upper: number, weights: number, alpha: number }[],
          ETL: number, RISK: number, RETURN: number, message: string
        }) => {
          console.log(DAT);
          if (DAT.port.length) {
            this.stockNames = DAT.port.map(d => d.names);
            this.stockLower = DAT.port.map(d => d.lower);
            this.stockUpper = DAT.port.map(d => d.upper);
            this.stockWeights = DAT.port.map(d => d.weights);
            this.stockAlpha = DAT.port.map(d => d.alpha);
            this.ETL = DAT.ETL;
            this.RISK = DAT.RISK;
            this.RETURN = DAT.RETURN;
            this.MESSAGE = DAT.message;
          }
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
            isString(i as string) ? i as string : d3.format('0.8f')(i as number);
          const etlFormat = (i: number | string) =>
            isString(i as string) ? i as string : d3.format('0.8f')(i as number);
          const ww = 1000, xPos = d3.scaleLinear().domain([0, this.cols + 1]).range([0, ww]),
            colourT = d3.interpolate(d3.rgb('orange'), d3.rgb('blue'));
          const hh = 31 * this.stockNames.length, yPos = d3.scaleLinear().domain([0, this.stockNames.length]).range([0, hh]);
          const tab = d3.select(this.mainScreen.nativeElement).select('#stockdata').append('div');
          tab.append('svg')
            .attr('width', ww)
            .attr('height', yPos(1))
            .selectAll('.heading').data(['Asset', 'Lower', 'Upper', 'weight', 'alpha']).enter()
            .append('text')
            .call(d => d.each((dd, i, j) => {
              d3.select(j[i]).append('tspan').attr('class', 'spacer').attr('x', xPos(i + 1)).attr('y', yPos(0.75))
                .style('fill', `${colourT((i + 1) / this.cols)}`).text(dd);
            }));
          tab.append('div').attr('class', 'inputData')
            .style('width', `${ww}px`)
            .style('height', `${yPos(1) * 1.02 * 10}px`)
            .style('background-color', 'black')
            .style('overflow-x', 'hidden')
            .style('overflow-y', 'scroll')
            .append('svg')
            .attr('width', ww)
            .attr('height', hh)
            .selectAll('.bounds')
            .data(this.stockNames).enter()
            .append('text')
            .call(d => d.each((dd, i, j) => {
              const here = d3.select(j[i]);
              for (let kk = 0; kk < this.cols; ++kk) {
                let out: number | string = dd;
                if (kk === 1) {
                  out = this.stockLower[i];
                } else if (kk === 2) {
                  out = this.stockUpper[i];
                } else if (kk === 3) {
                  out = this.stockWeights.length ? this.stockWeights[i] : '';
                } else if (kk === 4) {
                  out = this.stockAlpha.length ? this.stockAlpha[i] : '';
                } else if (kk === 0) {
                  out = this.stockNames[i];
                }
                const t = (kk + 1) / this.cols;
                here.append('tspan')
                  .attr('x', xPos(kk + 1))
                  .attr('y', yPos(i + 1))
                  .attr('class', 'spacer')
                  .style('fill', `${colourT(t)}`)
                  .text(tableFormat(out));
              }
            }));
          const inputFields = tab.append('div')
            .style('width', `${ww}px`)
            .style('height', `${yPos(1) * 2}px`)
            .attr('class', 'spacer')
            .style('color', colourT(0))
            .style('text-align-last', 'center').selectAll('iFields').data(['Etl Aversion', 'Return gamma']).enter()
            .append('div')
            .text(d => d)
            .append('input')
            .style('color', 'black')
            .style('background-color', 'chartreuse')
            .on('change', (d, i, j) => {
              const here = j[i];
              if (i === 0) {
                this.CVar_averse = +here.value;
              } else if (i === 1) {
                this.Return_gamma = +here.value;
              }
            })
            .nodes().forEach((d, i, j) => {
              if (i === 0) {
                d.value = `${this.CVar_averse}`;
              } else if (i === 1) {
                d.value = `${this.Return_gamma}`;
              }
            })
            ;
          const propLabels = ['ETL', 'RISK', 'RETURN'];
          d3.select(this.mainScreen.nativeElement).select('#valuesback').append('div').attr('class', 'spacer')
            .append('svg')
            .attr('width', ww)
            .attr('height', yPos(1) * 2)
            .selectAll('.properties').data([this.ETL, this.RISK, this.RETURN]).enter()
            .append('text')
            .attr('class', 'spacer')
            .style('fill', (d, i) => `${colourT(i / this.cols)}`)
            .attr('transform', (d, i) => `translate(${xPos(2) * (i + 1)},${yPos(1)})`)
            .text((d, i) => `${propLabels[i]}: ${etlFormat(d)}`)
            ;
          d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
            .on('click', (d, i, j) => {
              const id = i % this.cols;
              if (!(id === 1 || id === 2 || id === 4)) {
                return;
              }
              const stock = Math.floor(i / this.cols);
              console.log(i, id, stock);
              const here = (j[i] as SVGTSpanElement);
              const field = d3.select(this.mainScreen.nativeElement).select('#stockdata').append('input')
                .attr('class', 'inputField');
              field.attr('x', here.getAttribute('x'));
              field.attr('y', here.getAttribute('y'));
              field.node().value = here.textContent;
              field.on('change', (dd, ii, jj) => {
                const val = +jj[ii].value;
                console.log(val);
                if (id === 1) {
                  this.stockLower[stock - 1] = val;
                  here.textContent = `${val}`;
                } else if (id === 2) {
                  this.stockUpper[stock - 1] = val;
                  here.textContent = `${val}`;
                } else if (id === 4) {
                  this.stockAlpha[stock - 1] = val;
                  here.textContent = `${val}`;
                }
                field.remove();
              });
            });
          d3.select('#message').append('text')
            .style('color', 'darkgreen')
            .text(this.MESSAGE);
        });
  }
}
