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
  stockInitial: number[] = [];
  stockBuy: number[] = [];
  stockSell: number[] = [];
  CVar_averse = 1;
  Return_gamma = 0;
  ETL: number;
  RISK: number;
  RETURN: number;
  MESSAGE: string;
  cols = -1;
  sendLabel = 'SEND';
  noRiskModel = true;
  revise = 0;
  delta = -1;
  costs = 1;
  tableFormat = (i: number | string) =>
    isString(i as string) ? i as string : d3.format('0.8f')(i as number)
  etlFormat = (i: number | string) =>
    isString(i as string) ? i as string : d3.format('0.8f')(i as number)
  constructor(private dataService: DataService, private mainScreen: ElementRef) { }

  ngOnInit() {
    this.chooser();
  }
  clear() {
    d3.select('#valuesback').selectAll('div').remove();
  }
  sendData() {
    this.chooser();
  }
  zeroInitial() {
    for (let i = 0; i < this.stockAlpha.length; ++i) {
      this.stockInitial[i] = 0;
    }
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
      .nodes().forEach((d, ii, j) => {
        const k = Math.floor(ii / this.cols);
        if (k > 0) {
          if (ii % this.cols === 5) {
            (j[ii] as SVGTSpanElement).textContent = this.tableFormat(this.stockInitial[k - 1]);
          }
        }
      });
  }
  zeroAlpha() {
    for (let i = 0; i < this.stockAlpha.length; ++i) {
      this.stockAlpha[i] = 0;
    }
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
      .nodes().forEach((d, ii, j) => {
        const k = Math.floor(ii / this.cols);
        if (k > 0) {
          if (ii % this.cols === 4) {
            (j[ii] as SVGTSpanElement).textContent = this.tableFormat(this.stockAlpha[k - 1]);
          }
        }
      });
  }
  negateAlpha() {
    for (let i = 0; i < this.stockAlpha.length; ++i) {
      this.stockAlpha[i] = -this.stockAlpha[i];
    }
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
      .nodes().forEach((d, ii, j) => {
        const k = Math.floor(ii / this.cols);
        if (k > 0) {
          if (ii % this.cols === 4) {
            (j[ii] as SVGTSpanElement).textContent = this.tableFormat(this.stockAlpha[k - 1]);
          }
        }
      });
  }
  flowers(data: { axis: string, value: number }[][]) {
    const margin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    },
      ww = 1000,
      hh = 1000,
      width = ww - margin.left - margin.right,
      height = hh - margin.top - margin.bottom;
    let dk = 0;
    data.forEach((d) => {
      dk = Math.min(d3.min(d.map(dd => dd.value)), dk);
    });
    const dmin = dk;
    data.forEach((d) => {
      dk = Math.max(d3.max(d.map(dd => dd.value)), dk);
    });
    const dmax = dk;
    const radius = Math.min(width, height) / 2,
      rScale = d3.scaleLinear().domain([dmin, dmax]).range([0, radius]),
      angleScale = d3.scaleLinear().domain([0, data[0].length]).range([0, Math.PI * 2]);
    const svgbase = d3.select('#chart').append('svg')
      .attr('width', ww).attr('height', hh),
      svg = svgbase.append('g').attr('width', width).attr('height', height)
        .attr('transform', `translate(${width * 0.5 + margin.left},${height * 0.5 + margin.top})`),
      radarLine = d3.lineRadial<{ axis: string, value: number }>()
        .curve(d3.curveCardinalClosed)
        .radius((d) => rScale(d.value))
        .angle((d, i) => (angleScale(i)));
    const radarLineZ = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveCardinalClosed)
      .radius((d) => rScale(0))
      .angle((d, i) => (angleScale(-i)));
    svg.selectAll('portfolioFlower').data(data).enter()
      .append('path')
      .attr('class', 'portfolioflower')
      .style('fill', (d, i) => i % 2 === 0 ? 'rgba(255, 255, 0, 0.8)' : 'rgba(0, 255, 255, 0.8)')
      .attr('d', (d) => radarLine(d) + radarLineZ(d))
      .style('fill-opacity', 0.35)
      .on('mouseover', (d, i, jj) => {
        // Dim all blobs
        d3.selectAll('.portfolioflower')
          .transition().duration(200)
          .style('fill-opacity', 0.1);
        // Bring back the hovered over blob
        d3.select(jj[i])
          .transition().duration(200)
          .style('fill-opacity', 0.7);
      })
      .on('mouseout', () => d3.selectAll('.portfolioflower')
        .transition().duration(200)
        .style('fill-opacity', 0.35)
      );
    svg.selectAll('portfolioFlower').data(data).enter()
      .append('path')
      .attr('class', 'portfolioflower')
      .style('fill', 'none')
      .style('stroke', (d, i) => i % 2 === 0 ? 'rgba(255, 255, 0, 0.8)' : 'rgba(0, 255, 255, 0.8)')
      .attr('d', (d) => radarLine(d));
    svg.selectAll('portfolioFlower').data(data).enter().append('g')
      .attr('d_index', (d, i) => i).selectAll('poscircle')
      .data((d) => d).enter()
      .append('circle')
      .attr('class', 'portfolioflower')
      .style('stroke', 'none')
      .style('fill', (d, i, j) => +(j[i].parentNode as SVGGElement).getAttribute('d_index') % 2 === 0 ?
        'rgba(255, 255, 0, 0.8)' : 'rgba(0, 255, 255, 0.8)')
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI * 0.5))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI * 0.5))
      .attr('r', '5px');
    svg.append('circle')
      .attr('class', 'portfolioflower')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rScale(0));
  }
  chooser() {
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('div').remove();
    d3.select(this.mainScreen.nativeElement).select('#message').selectAll('text').remove();
    d3.select(this.mainScreen.nativeElement).select('#chart').selectAll('svg').remove();
    this.dataService.sendData('etl', {
      names: this.stockNames, lower: this.stockLower, upper: this.stockUpper, alpha: this.stockAlpha, initial: this.stockInitial,
      buy: this.stockBuy, sell: this.stockSell,
      CVar_averse: this.CVar_averse, gamma: this.Return_gamma, noRiskModel: this.noRiskModel, revise: this.revise, delta: this.delta,
      costs: this.costs
    })
      .subscribe(
        (DAT: {
          port: {
            names: string, lower: number, upper: number, weights: number, alpha: number, initial: number,
            buy: number, sell: number
          }[],
          ETL: number, RISK: number, RETURN: number, message: string
        }) => {
          console.log(DAT);
          if (DAT.port.length) {
            this.stockNames = DAT.port.map(d => d.names);
            this.stockLower = DAT.port.map(d => d.lower);
            this.stockUpper = DAT.port.map(d => d.upper);
            this.stockWeights = DAT.port.map(d => d.weights);
            this.stockAlpha = DAT.port.map(d => d.alpha);
            this.stockInitial = DAT.port.map(d => d.initial);
            this.stockBuy = DAT.port.map(d => d.buy);
            this.stockSell = DAT.port.map(d => d.sell);
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
          const inputHeadings = [];
          if (DAT.port[0].names !== undefined) {
            inputHeadings.push('Asset');
          }
          if (DAT.port[0].lower !== undefined) {
            inputHeadings.push('Lower');
          }
          if (DAT.port[0].upper !== undefined) {
            inputHeadings.push('Upper');
          }
          if (DAT.port[0].weights !== undefined) {
            inputHeadings.push('Weight');
          }
          if (DAT.port[0].alpha !== undefined) {
            inputHeadings.push('Alpha');
          }
          if (DAT.port[0].initial !== undefined) {
            inputHeadings.push('Initial');
          }
          if (DAT.port[0].buy !== undefined) {
            inputHeadings.push('Buy');
          }
          if (DAT.port[0].sell !== undefined) {
            inputHeadings.push('Sell');
          }
          this.cols = inputHeadings.length;
          const fixedTableWidth = 1000, ww = Math.max(fixedTableWidth, fixedTableWidth / 7 * (this.cols + 1)),
            xPos = d3.scaleLinear().domain([0, this.cols + 1]).range([0, ww]),
            colourT = d3.interpolate(d3.rgb('orange'), d3.rgb('blue'));
          const hh = 31 * this.stockNames.length, yPos = d3.scaleLinear().domain([0, this.stockNames.length]).range([0, hh]);
          const tab = d3.select(this.mainScreen.nativeElement).select('#stockdata').append('div')
            .style('overflow-x', 'scroll')
            .style('width', `${fixedTableWidth}px`);
          tab.append('svg')
            .attr('width', ww)
            .attr('height', yPos(1))
            .selectAll('.heading').data(inputHeadings).enter()
            .append('text')
            .call(d => d.each((dd, i, j) => {
              d3.select(j[i]).append('tspan').attr('class', 'spacer').attr('x', xPos(i + 1)).attr('y', yPos(0.75))
                .style('fill', `${colourT((i + 1) / this.cols)}`).text(dd);
            }));
          const fixedTableHeight = yPos(1) * 1.02 * 10;
          tab.append('div').attr('class', 'inputData')
            .style('width', `${ww}px`)
            .style('height', `${fixedTableHeight}px`)
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
                } else if (kk === 5) {
                  out = this.stockInitial.length ? this.stockInitial[i] : '';
                } else if (kk === 6) {
                  out = this.stockBuy.length ? this.stockBuy[i] : '';
                } else if (kk === 7) {
                  out = this.stockSell.length ? this.stockSell[i] : '';
                } else if (kk === 0) {
                  out = this.stockNames[i];
                }
                const t = (kk + 1) / this.cols;
                here.append('tspan')
                  .attr('x', xPos(kk + 1))
                  .attr('y', yPos(i + 1))
                  .attr('class', 'spacer')
                  .style('fill', `${colourT(t)}`)
                  .text(this.tableFormat(out));
              }
            }));
          const scalarParams = ['Etl Aversion', 'Return gamma', 'Zero Risk Model', 'Revision', 'Turnover', 'T. Costs'];
          const inputFields = tab.append('div')
            .style('width', `${fixedTableWidth}px`)
            .style('height', `${yPos(1) * scalarParams.length / 2}px`)
            .attr('class', 'spacer')
            .style('color', colourT(0))
            .style('text-align', 'justify')
            .selectAll('iFields').data(scalarParams).enter()
            .append('text')
            .style('color', (d, i, j) => colourT((i + 1) / this.cols))
            .text(d => d)
            .append('input')
            .style('color', (d, i, j) => colourT((i + 1) / this.cols))
            .style('background-color', 'chartreuse')
            .on('change', (d, i, j) => {
              const here = j[i];
              if (i === 0) {
                this.CVar_averse = +here.value;
              } else if (i === 1) {
                this.Return_gamma = +here.value;
              } else if (i === 2) {
                this.noRiskModel = here.value === 'true' ? true : false;
              } else if (i === 3) {
                this.revise = +here.value;
              } else if (i === 4) {
                this.delta = +here.value;
              } else if (i === 5) {
                this.costs = +here.value;
              }
            })
            .nodes().forEach((d, i, j) => {
              if (i === 0) {
                d.value = `${this.CVar_averse}`;
              } else if (i === 1) {
                d.value = `${this.Return_gamma}`;
              } else if (i === 2) {
                d.value = this.noRiskModel ? 'true' : 'false';
              } else if (i === 3) {
                d.value = `${this.revise}`;
              } else if (i === 4) {
                d.value = `${this.delta}`;
              } else if (i === 5) {
                d.value = `${this.costs}`;
              }
            })
            ;
          const propLabels = ['ETL', 'RISK', 'RETURN'];
          const propData = [this.ETL, this.RISK, this.RETURN];
          let turnoverAchieved = 0, transactionCost = 0;
          if (this.revise) {
            this.stockWeights.forEach((d, i) => {
              turnoverAchieved += Math.abs(d - this.stockInitial[i]);
            });
            turnoverAchieved *= 0.5;
            propLabels.push('TURNOVER');
            propData.push(turnoverAchieved);
          }
          if (this.stockInitial.length && this.stockBuy.length && this.stockSell.length) {
            this.stockWeights.forEach((d, i) => {
              transactionCost += (d - this.stockInitial[i]) > 0 ? (d - this.stockInitial[i]) * this.stockBuy[i] :
                -(d - this.stockInitial[i]) * this.stockSell[i];
            });
            propLabels.push('COST');
            propData.push(transactionCost);
            propLabels.push('ETL+COST');
            propData.push(this.ETL + transactionCost);
            propLabels.push('ETL+COST-gRETURN');
            propData.push(this.ETL + transactionCost - this.Return_gamma * (1 - this.Return_gamma) * this.RETURN);
          }
          d3.select(this.mainScreen.nativeElement).select('#valuesback').append('div').attr('class', 'spacer')
            .selectAll('.properties').data(propData).enter()
            .append('text')
            .style('color', (d, i) => `${colourT(i / (propLabels.length - 1))}`)
            .text((d, i) => `${propLabels[i]}: ${this.etlFormat(d)}  `)
            ;
          d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
            .on('click', (d, i, j) => {
              const id = i % this.cols;
              if (!(id === 1 || id === 2 || id === 4 || id === 5 || id === 6 || id === 7)) {
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
                } else if (id === 5) {
                  this.stockInitial[stock - 1] = val;
                  here.textContent = `${val}`;
                } else if (id === 6) {
                  this.stockBuy[stock - 1] = val;
                  here.textContent = `${val}`;
                } else if (id === 7) {
                  this.stockSell[stock - 1] = val;
                  here.textContent = `${val}`;
                }
                field.remove();
              });
            });
          d3.select('#message').append('text')
            .style('color', 'darkgreen')
            .text(this.MESSAGE);
          d3.select('#valuesback')
            .call(d => { const here = (d.node() as HTMLParagraphElement); here.scrollTop = here.scrollHeight; });
          const plotData: { axis: string, value: number }[][] = [];
          const p1: { axis: string, value: number }[] = [];
          this.stockNames.forEach((d, i) => {
            p1.push({ axis: d, value: this.stockWeights[i] });
          });
          const p2: { axis: string, value: number }[] = [];
          this.stockNames.forEach((d, i) => {
            p2.push({ axis: d, value: this.stockInitial[i] });
          });
          plotData.push(p1);
          plotData.push(p2);
          this.flowers(plotData);

        });
  }
}
