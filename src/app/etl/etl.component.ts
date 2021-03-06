import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { isString } from 'util';

@Component({
  selector: 'app-etl',
  templateUrl: './etl.component.html',
  styleUrls: ['./etl.component.css']
})
export class EtlComponent implements OnInit {
  tTip = d3.select(this.mainScreen.nativeElement).append('g').attr('class', 'tooltip');
  stockNames: string[] = [];
  stockLower: number[] = [];
  stockUpper: number[] = [];
  stockWeights: number[] = [];
  stockAlpha: number[] = [];
  stockInitial: number[] = [];
  stockBuy: number[] = [];
  stockSell: number[] = [];
  tableOrder: number[] = [];
  tableOrderInverse: number[] = [];
  flowerTitle = 'Current Portfolio';
  CVar_averse = 1;
  Return_gamma = 0.5;
  maxNonZero: number;
  ETL: number;
  back: number;
  scaleExp = 0.2;
  maxZ = 4;
  minRangeMaxZ: number;
  scale = 1e4;
  RETURN: number;
  MESSAGE: string;
  cols = -1;
  sendLabel = 'OPTIMISE';
  noRiskModel = true;
  revise = 1;
  delta = -1;
  costs = 1;
  relEtl = false;
  useSticks = true;
  CVar_constraint = 0;
  CVarMax = 0;
  CVarMin = 0;
  anim = true;
  stockBasket = -1;
  stockTrades = -1;
  stockMinHold = -1;
  stockMinTrade = -1;
  colourT = d3.interpolate(d3.rgb('orange'), d3.rgb('blue'));
  propLabels: string[];
  propData = [];
  eps = Math.abs((4 / 3 - 1) * 3 - 1);
  scaleFormat = (i: number) => d3.format('0.2f')(i);
  tableFormat = (i: number | string) =>
    isString(i as string) ? i as string : d3.format('0.8f')(i as number)
  etlFormat = (i: number | string) =>
    isString(i as string) ? i as string : d3.format('0.8f')(i as number)
  constructor(private dataService: DataService, private mainScreen: ElementRef) { }

  ngOnInit() {
    this.anim = true;
    d3.select(this.mainScreen.nativeElement).attr('greentitle', 'ETL Optimisation');
    (d3.select(this.mainScreen.nativeElement).select('#sticks').select('input').node() as HTMLInputElement).checked = this.useSticks;
    this.chooser();
  }
  stickFlowers() {
    this.useSticks = (d3.select(this.mainScreen.nativeElement).select('#sticks').select('input').node() as HTMLInputElement).checked;
    this.anim = true;
  }
  sendData() {
    this.chooser();
  }
  basket(x: number[], initial: number[] = []) {
    let count = 0, hold = 1e10;
    for (let i = 0; i < x.length; ++i) {
      const diff = Math.abs(initial.length ? x[i] - initial[i] : x[i]);
      if (diff > this.eps) {
        count++;
        hold = Math.min(hold, diff);
      }
    }
    if (hold === 1e10) {
      hold = 0;
    }
    return { holding: hold, number: count };
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
  flowers(data: { axis: string, value: number }[][], id = '#chart') {
    data.forEach(dki => {
      dki = this.reOrderArray(dki);
    });
    if (this.useSticks) {
      const data1: { axis: string, value: number }[][] = [];
      data.forEach(d1 => {
        const d11: { axis: string, value: number }[] = [];
        d1.forEach(d2 => {
          d11.push(d2); d11.push({ axis: '', value: 0 });
        });
        data1.push(d11);
      });
      data = data1;
    }
    const margin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    },
      ww = 500,
      hh = 500,
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
    const svgbase = d3.select(id)
      .append('svg')
      .attr('width', ww).attr('height', hh),
      svg = svgbase.append('g').attr('width', width).attr('height', height)
        .attr('transform', `translate(${width * 0.5 + margin.left},${height * 0.5 + margin.top})`),
      radarLine = d3.lineRadial<{ axis: string, value: number }>()
        .curve(d3.curveLinearClosed)
        .radius((d) => rScale(d.value))
        .angle((d, i) => (angleScale(i)));
    const radarLineZ = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(0))
      .angle((d, i) => (angleScale(-i)));
    const lineLable = (y1: number, x1 = -ww / 2, s1 = 20) => `M${x1},${y1}l0,${s1}l${s1},0l0,-${s1}z`;
    svg.selectAll('.portfolioFlower').data(data).enter()
      .append('text')
      .attr('class', (d, i) => i === 0 ? 'portfolioflower zero' : 'portfolioflower one')
      .attr('transform', (d, i) => `translate(${-ww / 2 + 21},${i * 20 - hh / 2 + 20})`)
      .text((d, i) => i % 2 === 0 ? 'Optimised' : 'Initial');
    svg.selectAll('.portfolioFlower').data(data).enter()
      .append('path')
      .style('stroke', 'none')
      .attr('class', (d, i) => i === 0 ? 'portfolioflower zero' : 'portfolioflower one')
      .attr('d', (d, i) => radarLine(d) + radarLineZ(d) + lineLable(i * 20 - hh / 2))
      .style('fill-opacity', 1)
      .on('mouseover', (e: Event) => {
        svg.selectAll('path.portfolioflower')
          .transition().duration(200)
          .style('fill-opacity', 0.1);
        d3.select(e.currentTarget as SVGPathElement)
          .transition().duration(200)
          .style('fill-opacity', 0.7);
      })
      .on('mouseout', () => d3.selectAll('.portfolioflower')
        .transition().duration(1000)
        .style('fill-opacity', 1)
      );
    svg.selectAll('.portfolioFlower').data(data).enter()
      .append('path')
      .style('fill', 'none')
      .attr('class', (d, i) => i === 0 ? 'portfolioflower zero' : 'portfolioflower one')
      .attr('d', (d) => radarLine(d));
    svg.selectAll('.portfolioFlower').data(data).enter().append('g')
      .attr('d_index', (d, i) => i).selectAll('.poscircle')
      .data((d) => d).enter()
      .append('circle')
      .style('stroke', 'none')
      .attr('class', (d, i, j) => +(j[i].parentNode as SVGGElement).getAttribute('d_index') % 2 === 0 ?
        'portfolioflower zero' : 'portfolioflower one')
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI * 0.5))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI * 0.5))
      .attr('r', (d, i) => this.useSticks ? (i % 2 === 0 ? '3px' : '0px') : '3px')
      .on('mouseover', (e: MouseEvent, d) => {
        this.tTip.attr('style', `left:${e.pageX + 20}px;top:${e.pageY + 20}px;display:inline-block`)
          .html(`<i class='fa fa-weibo leafy'></i>
          ${+((e.currentTarget as SVGCircleElement).parentNode as SVGGElement).getAttribute('d_index') === 0 ? 'Optimised' : 'Initial'}
          <br>${d.axis}<br>${this.etlFormat(d.value)}`);
      })
      .on('mouseout', () => {
        this.tTip.attr('style', `display:none`)
          .html('');
      });
    svg.append('circle')
      .attr('class', 'portfolioflower')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', rScale(0));
  }
  reOrderArray(aa: any[], order = this.tableOrder) {
    const bb: any[] = Array(aa.length);
    for (let i = 0; i < aa.length; ++i) {
      bb[i] = aa[order[i]];
    }
    return bb;
  }
  myDisplay(DAT: {
    port: {
      names: string, lower: number, upper: number, weights: number, alpha: number, initial: number,
      buy: number, sell: number
    }[],
    back: number, ETL: number, RETURN: number, message: string, gamma: number, relEtl: boolean
  }) {
    console.log(DAT);
    if (DAT.port.length) {
      this.stockNames = this.reOrderArray(DAT.port.map(d => d.names));
      this.stockLower = this.reOrderArray(DAT.port.map(d => d.lower));
      this.stockUpper = this.reOrderArray(DAT.port.map(d => d.upper));
      this.stockWeights = this.reOrderArray(DAT.port.map(d => d.weights));
      this.stockAlpha = this.reOrderArray(DAT.port.map(d => d.alpha));
      this.stockInitial = this.reOrderArray(DAT.port.map(d => d.initial));
      this.stockBuy = this.reOrderArray(DAT.port.map(d => d.buy));
      this.stockSell = this.reOrderArray(DAT.port.map(d => d.sell));
      this.back = DAT.back;
      this.ETL = DAT.ETL;
      this.RETURN = DAT.RETURN;
      this.MESSAGE = DAT.message;
      this.Return_gamma = DAT.gamma;
      this.relEtl = DAT.relEtl;
      this.flowerTitle = !DAT.message.length ? this.flowerTitle :
        (DAT.back !== 6 ? 'Optimal Changes to Portfolio' : 'Changes to Portfolio');
      if (!DAT.message.length) {
        this.CVarMax = DAT.ETL;
        this.CVarMin = DAT.ETL;
      }
      this.maxNonZero = 0;
      this.stockWeights.forEach((d, i) => {
        if (Math.abs(d) > 0 || Math.abs(this.stockInitial[i]) > 0) {
          this.maxNonZero++;
        }
      });
      this.minRangeMaxZ = this.maxZ = this.maxNonZero; // The maximum of the range
    }
    /*
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
    */
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
    const fixedTableWidth = 1000, ftCols = 3, ww = Math.max(fixedTableWidth, fixedTableWidth / 7 * (this.cols + 1)),
      xPos = d3.scaleLinear().domain([0, this.cols + 1]).range([0, ww]);
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
          .style('fill', `${this.colourT((i + 1) / this.cols)}`).text(dd);
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
            .style('fill', `${this.colourT(t)}`)
            .text(this.tableFormat(out));
        }
      }));
    const scalarParams = ['Zero Risk Model', 'ETL Constraint', 'Relative Etl', 'Etl Aversion', 'Return gamma', 'Revision', 'Turnover',
      'T. Costs', 'ETL min', 'ETL max', 'Basket', 'Trades', 'Min. holding', 'Min. trade'];
    const inputFields = tab.append('div')
      .style('width', `${fixedTableWidth}px`)
      .style('height', `${yPos(1) * scalarParams.length / 2}px`)
      .attr('class', 'spacer')
      .style('color', this.colourT(0))
      .selectAll('iFields').data(scalarParams).enter().append('div')
      .style('text-align', 'end')
      .style('background-color', 'black')
      .style('float', 'left')
      .style('width', `${fixedTableWidth}px`);
    inputFields.transition().duration(1000)
      .style('background-color', 'burlywood')
      .styleTween('float', () => (t) => t < 0.95 ? 'right' : 'left')
      .style('width', `${fixedTableWidth / ftCols}px`);
    const inputInputs = inputFields.append('text') // actually uses width:auto;float:right in the css
      .style('color', this.colourT(1))
      .text(d => d)
      .append('input');
    inputInputs
      .attr('type', (d, i) => i < 3 ? 'checkbox' : '')
      .style('color', (d, i) => i < 3 ? 'auto' : this.colourT(0.5))
      .style('width', (d, i) => i < 3 ? 'auto' : `inherit`)
      .style('background-color', (d, i) => i < 3 ? 'auto' : 'chartreuse')
      .on('change', (e: Event) => {
        const i = inputInputs.nodes().indexOf(e.currentTarget as HTMLInputElement);
        const here = e.currentTarget as HTMLInputElement;
        if (i === 0) {
          this.noRiskModel = here.checked;
        } else if (i === 1) {
          this.CVar_constraint = here.checked ? 1 : 0;
        } else if (i === 2) {
          this.relEtl = here.checked;
        } else if (i === 3) {
          this.CVar_averse = +here.value;
        } else if (i === 4) {
          this.Return_gamma = +here.value;
        } else if (i === 5) {
          this.revise = +here.value;
        } else if (i === 6) {
          this.delta = +here.value;
        } else if (i === 7) {
          this.costs = +here.value;
        } else if (i === 8) {
          this.CVarMin = +here.value;
        } else if (i === 9) {
          this.CVarMax = +here.value;
        } else if (i === 10) {
          this.stockBasket = +here.value;
        } else if (i === 11) {
          this.stockTrades = +here.value;
        } else if (i === 12) {
          this.stockMinHold = +here.value;
        } else if (i === 13) {
          this.stockMinTrade = +here.value;
        }
      })
      .nodes().forEach((d, i, j) => {
        if (i === 0) {
          d.checked = this.noRiskModel;
        } else if (i === 1) {
          d.checked = this.CVar_constraint === 1;
        } else if (i === 2) {
          d.checked = this.relEtl;
        } else if (i === 3) {
          d.value = `${this.CVar_averse}`;
        } else if (i === 4) {
          d.value = `${this.Return_gamma}`;
        } else if (i === 5) {
          d.value = `${this.revise}`;
        } else if (i === 6) {
          d.value = `${this.delta}`;
        } else if (i === 7) {
          d.value = `${this.costs}`;
        } else if (i === 8) {
          d.value = `${this.CVarMin}`;
        } else if (i === 9) {
          d.value = `${this.CVarMax}`;
        } else if (i === 10) {
          d.value = `${this.stockBasket}`;
        } else if (i === 11) {
          d.value = `${this.stockTrades}`;
        } else if (i === 12) {
          d.value = `${this.stockMinHold}`;
        } else if (i === 13) {
          d.value = `${this.stockMinTrade}`;
        }
      })
      ;
    const h1 = this.basket(this.stockWeights);
    const t1 = this.basket(this.stockWeights, this.stockInitial);
    const minHolding = h1.holding;
    const minTrade = t1.holding;
    this.minRangeMaxZ = h1.number > 0 ? h1.number : 0; // The minimum of the range
    const basketHolding = `${h1.number}`;
    const basketTrade = `${t1.number}`;
    this.propLabels = ['ETL', 'RETURN', 'Non-zero weights', 'Min. holding'];
    this.propData = [this.ETL, this.RETURN, basketHolding, minHolding];
    if (this.stockInitial.length) {
      this.propLabels.push('Non-zero trades');
      this.propData.push(basketTrade);
      this.propLabels.push('Min. trade');
      this.propData.push(minTrade);
    }
    let turnoverAchieved = 0, transactionCost = 0;
    if (this.revise) {
      this.stockWeights.forEach((d, i) => {
        turnoverAchieved += Math.abs(d - this.stockInitial[i]);
      });
      turnoverAchieved *= 0.5;
      this.propLabels.push('TURNOVER');
      this.propData.push(turnoverAchieved);
    }
    if (this.stockInitial.length && this.stockBuy.length && this.stockSell.length) {
      this.stockWeights.forEach((d, i) => {
        transactionCost += (d - this.stockInitial[i]) > 0 ? (d - this.stockInitial[i]) * this.stockBuy[i] :
          -(d - this.stockInitial[i]) * this.stockSell[i];
      });
      this.propLabels.push('COST');
      this.propData.push(transactionCost);
    }
    /*   d3.select(this.mainScreen.nativeElement).select('#valuesback').append('div').attr('class', 'spacer')
         .selectAll('.properties').data(propData).enter()
         .append('text')
         .style('color', (d, i) => `${this.colourT(i / (this.propLabels.length - 1))}`)
         .text((d, i) => `${this.propLabels[i]}: ${this.etlFormat(d)}  `)
         ;*/
    const tSpans = d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('tspan')
      .on('click', (e: Event) => {
        const i = tSpans.nodes().indexOf(e.currentTarget as SVGTSpanElement);
        const id = i % this.cols;
        const stock = Math.floor(i / this.cols);
        if (stock === 0) {
          for (let io = 0; io < this.tableOrder.length; ++io) {
            this.tableOrder[io] = io;
          }
          if (!(id === 3 || id === 4 || id === 5)) {
            return;
          }
          if (id === 3) {
            this.tableOrder.sort((k, l) => {
              if (this.stockWeights[k] < this.stockWeights[l]) {
                return 1;
              } else if (this.stockWeights[k] === this.stockWeights[l]) {
                return 0;
              } else {
                return -1;
              }
            });
          }
          if (id === 4) {
            this.tableOrder.sort((k, l) => {
              if (this.stockAlpha[k] < this.stockAlpha[l]) {
                return 1;
              } else if (this.stockAlpha[k] === this.stockAlpha[l]) {
                return 0;
              } else {
                return -1;
              }
            });
          }
          if (id === 5) {
            this.tableOrder.sort((k, l) => {
              if (this.stockInitial[k] < this.stockInitial[l]) {
                return 1;
              } else if (this.stockInitial[k] === this.stockInitial[l]) {
                return 0;
              } else {
                return -1;
              }
            });
          }
          d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('div').remove();
          //        d3.select(this.mainScreen.nativeElement).select('#message').selectAll('text').remove();
          for (let ii = 0; ii < this.tableOrder.length; ++ii) {
            this.tableOrderInverse[this.tableOrder[ii]] = ii;
          }
          this.myDisplay(DAT);
          return;
        }
        if (!(id === 1 || id === 2 || id === 4 || id === 5 || id === 6 || id === 7)) {
          return;
        }
        const here = (e.currentTarget as SVGTSpanElement);
        const field = d3.select(this.mainScreen.nativeElement).select('#stockdata').append('input')
          .attr('class', 'inputField');
        field.attr('x', here.getAttribute('x'));
        field.attr('y', here.getAttribute('y'));
        field.node().value = here.textContent;
        field.on('change', (ee: Event) => {
          const val = +(ee.currentTarget as HTMLInputElement).value;
          if (id === 1) {
            this.stockLower[this.tableOrder[stock - 1]] = val;
            here.textContent = `${val}`;
          } else if (id === 2) {
            this.stockUpper[this.tableOrder[stock - 1]] = val;
            here.textContent = `${val}`;
          } else if (id === 4) {
            this.stockAlpha[this.tableOrder[stock - 1]] = val;
            here.textContent = `${val}`;
          } else if (id === 5) {
            this.stockInitial[this.tableOrder[stock - 1]] = val;
            here.textContent = `${val}`;
          } else if (id === 6) {
            this.stockBuy[this.tableOrder[stock - 1]] = val;
            here.textContent = `${val}`;
          } else if (id === 7) {
            this.stockSell[this.tableOrder[stock - 1]] = val;
            here.textContent = `${val}`;
          }
          field.remove();
        });
      });
    /*d3.select(this.mainScreen.nativeElement).select('#message').append('text')
      .style('color', 'darkgreen')
      .text(this.MESSAGE);*/
    /*    d3.select(this.mainScreen.nativeElement).select('#valuesback')
          .call(d => { const here = (d.node() as HTMLParagraphElement); here.scrollTop = here.scrollHeight; });*/
    /*    const plotData: { axis: string, value: number }[][] = [];
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
        this.flowers(plotData);*/

    /*    d3.select(this.mainScreen.nativeElement).select('#chart')
          .call(d => {
            const here = (((d.node() as HTMLDivElement).parentNode as HTMLDivElement).parentNode as HTMLParagraphElement);
            // This will allow us to scroll left for ever
            ((d.node() as HTMLDivElement).parentNode as HTMLDivElement)
              .setAttribute('style', `width:${500 * ((d.node() as HTMLDivElement).children.length)}px`);
            // This will scroll to the start of the second to last figure so that the last 2 are always seen
            if (((d.node() as HTMLDivElement).children.length) > 2) {
              here.scrollLeft = 500 * ((d.node() as HTMLDivElement).children.length - 2);
            }
          });*/
    this.stockNames = this.reOrderArray(this.stockNames, this.tableOrderInverse);
    this.stockLower = this.reOrderArray(this.stockLower, this.tableOrderInverse);
    this.stockUpper = this.reOrderArray(this.stockUpper, this.tableOrderInverse);
    this.stockWeights = this.reOrderArray(this.stockWeights, this.tableOrderInverse);
    this.stockAlpha = this.reOrderArray(this.stockAlpha, this.tableOrderInverse);
    this.stockInitial = this.reOrderArray(this.stockInitial, this.tableOrderInverse);
    this.stockBuy = this.reOrderArray(this.stockBuy, this.tableOrderInverse);
    this.stockSell = this.reOrderArray(this.stockSell, this.tableOrderInverse);
  }
  chooser() {
    d3.select(this.mainScreen.nativeElement).select('#stockdata').selectAll('div').remove();
    //  d3.select(this.mainScreen.nativeElement).select('#message').selectAll('text').remove();
    this.dataService.sendData('etl', {
      names: this.stockNames, lower: this.stockLower, upper: this.stockUpper, alpha: this.stockAlpha, initial: this.stockInitial,
      buy: this.stockBuy, sell: this.stockSell,
      CVar_averse: this.CVar_averse, gamma: this.Return_gamma, noRiskModel: this.noRiskModel, revise: this.revise, delta: this.delta,
      costs: this.costs, relEtl: this.relEtl, CVar_constraint: this.CVar_constraint, CVarMax: this.CVarMax, CVarMin: this.CVarMin,
      basket: this.stockBasket, trades: this.stockTrades, min_holding: this.stockMinHold, min_trade: this.stockMinTrade
    })
      .subscribe(
        (DAT: {
          port: {
            names: string, lower: number, upper: number, weights: number, alpha: number, initial: number,
            buy: number, sell: number
          }[],
          back: number, ETL: number, RETURN: number, message: string, gamma: number, relEtl: boolean
        }) => {
          this.anim = true;
          this.tableOrder = Array(DAT.port.length);
          this.tableOrderInverse = Array(DAT.port.length);
          for (let i = 0; i < this.tableOrder.length; ++i) {
            this.tableOrder[i] = i;
            this.tableOrderInverse[i] = i;
          }
          this.myDisplay(DAT);
        });
  }
  newscale(b: Event) {
    const back = b.target as HTMLInputElement;
    this.scaleExp = +back.value / this.scale;
    this.anim = false;
  }
  newmaxZ(b: Event) {
    const back = b.target as HTMLInputElement;
    this.maxZ = +back.value;
    this.anim = false;
  }
}
