import { Component, OnInit, Input, OnChanges, ElementRef, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-vert-bar-chart',
  templateUrl: './vert-bar-chart.component.html',
  styleUrls: ['./vert-bar-chart.component.css']
})
export class VertBarChartComponent implements OnInit, OnChanges {
  @Output() selectAsset = new EventEmitter<{ index: number, axis: string, value: number, alpha: number, inout: boolean }>();
  @Input() DATA: { index: number, axis: string, value: number, alpha: number }[];
  @Input() maxsplit=8;
  @Input() scaleHere = 1;
  @Input() ww: number;
  @Input() hh: number;
  @Input() colour: string[];
  @Input() xText: string;
  @Input() yText: string;
  @Input() yTickFormat: (d: number) => string = null;
  @Input() left = 12000;
  @Input() keepBarMax = 0;
  @Input() keepBarMin = 0;
  @Input() animationTime = 2000;
  @Input() margin = {
    top: 50 * this.scaleHere,
    right: 50 * this.scaleHere,
    bottom: 150 * this.scaleHere,
    left: this.left * this.scaleHere
  };
  eps = Math.abs((4 / 3 - 1) * 3 - 1);
  bandfiddle = 10000;
  rim = 5 * this.scaleHere;
  width = this.ww * this.scaleHere - this.margin.left - this.margin.right;
  height = this.hh * this.scaleHere - this.margin.top - this.margin.bottom;
  y: d3.ScaleLinear<number, number>;
  niceTop = 0;
  niceBot = 0;
  delts: number[] = [];
  constructor(private element: ElementRef) { }
  ngOnInit() {
    this.draw();
    this.update();
  }
  ngOnChanges() {
    this.draw();
    this.update();
  }
  out = (d: number, high: number, low: number) => d > high || d < low;
  translatehack = (a: number, b: number, r = 0) => r === 0 ? `translate(${a},${b})` : `translate(${a},${b}) rotate(${r})`;
  mousey(event: MouseEvent, i: number, d: { index: number, axis: string, value: number, alpha: number }, inout: boolean) {
    const origin = (d3.select('app-client-fact').node() as HTMLElement).getBoundingClientRect();
    const here = d3.select(event.target as SVGRectElement);
    const isRim = here.attr('class').search('rim') > -1;
    if (!isRim) {
      here
        .transition().duration(300)
        .styleTween('fill-opacity', () => t => `${inout ? 0.7 * t : 0.35 * t}`);
    }
    if (inout) {
      d3.select('body').select('#tiphere.toolTip').style('left', `${event.pageX - origin.left}px`)
        .style('top', `${event.pageY - origin.top}px`).style('display', 'inline-block')
        .html(`<i class="fa fa-gears leafy"></i>${d.axis}<br>
        ${this.yTickFormat === null ? d3.format('0.5f')(d.value) : d3.format('0.4%')(d.value)}<br>
        ${d.alpha === undefined ? '' : 'alpha:' + d3.format('0.5f')(d.alpha)}`);
    } else {
      d3.select('body').select('#tiphere.toolTip').style('display', 'none');
    }
    event.stopPropagation();
    this.selectAsset.emit({ index: i, axis: d.axis, alpha: d.alpha, value: d.value, inout });
  }
  draw() {
    this.margin = {
      top: 50 * this.scaleHere,
      right: 50 * this.scaleHere,
      bottom: 150 * this.scaleHere,
      left: this.left * this.scaleHere
    };
    this.rim = 5 * this.scaleHere;
    this.width = this.ww * this.scaleHere - this.margin.left - this.margin.right;
    this.height = this.hh * this.scaleHere - this.margin.top - this.margin.bottom;
    this.y = d3.scaleLinear<number, number>().range([this.height, 0])
      .domain([Math.min(this.keepBarMin, d3.min(this.DATA, (d) => d.value)),
      Math.max(this.keepBarMax, d3.max(this.DATA, d => d.value))]);
    if (this.DATA.length) {
      this.keepBarMax = this.y.domain()[1];
      this.keepBarMin = this.y.domain()[0];
    }
    const svg = d3.select(this.element.nativeElement).select('svg').select('g');
  }
  update = () =>
    setTimeout(() => {
      this.y = d3.scaleLinear<number, number>().range([this.height, 0])
        .domain([Math.min(this.keepBarMin, d3.min(this.DATA, (d) => d.value)),
        Math.max(this.keepBarMax, d3.max(this.DATA, d => d.value))]);
      if (this.DATA.length) {
        this.keepBarMax = this.y.domain()[1];
        this.keepBarMin = this.y.domain()[0];
      }
      let fff = 1;
      this.niceTop = +d3.format(`2.${fff}f`)(this.y.invert(0));
      this.niceBot = +d3.format(`2.${fff}f`)(this.y.invert(this.height));
      while ((this.niceBot === 0 || this.niceTop === 0) && fff < 5) {
        fff++;
        this.niceTop = +d3.format(`2.${fff}f`)(this.y.invert(0));
        this.niceBot = +d3.format(`2.${fff}f`)(this.y.invert(this.height));
      }
      const step = this.niceStep(this.niceTop - this.niceBot);
      const nstep = Math.floor((this.niceTop - this.niceBot) / step + 1);
      this.delts = Array(Math.floor(nstep));
      for (let i = 0; i < this.delts.length; ++i) {
        this.delts[i] = step * i + step * Math.floor(this.niceBot / step);
      }
      d3.select(this.element.nativeElement).select('svg').select('g').selectAll('rect.proper').data(this.DATA)
        .transition().duration(this.animationTime)
        .attrTween('height', (d) => t => `${d.value <= 0 ? (this.y(d.value) - this.y(0)) * t : (this.y(0) - this.y(d.value)) * t}`)
        .attrTween('y', d => t => `${d.value <= 0 ? this.y(0) * t : this.y(d.value) * t}`);
      d3.select(this.element.nativeElement).selectAll('text#bottom.axisNames')
        .transition().duration(this.animationTime)
        .attrTween('transform', (d, i) => t => `${this.translatehack((i + 0.25) * this.width / this.DATA.length, this.height, -70 * t)}`);
    })

  percent = (a: number) => Math.abs(a) < this.eps ? '0' : d3.format('0.1%')(a);
  nameSplit = (n: string, maxl = this.maxsplit) => {
    const words = n.split(' ');
    words.forEach(d => {
      maxl = Math.max(maxl, d.length);
    });
    const back: string[] = Array(2);
    if (n.length > maxl) {
      back[0] = '';
      back[1] = '';
      words.forEach(d => {
        if (back[0] === '') {
          back[0] = d+' ';
        } else if (back[0].length + d.length < maxl) {
          back[0] += d + ' ';
        } else if (back[1].length + d.length < maxl) {
          back[1] += d + ' ';
        }
      });
    } else {
      back[0] = n;
      back[1] = '';
    }
    back[0] = back[0].replace(/ $/, '');
    back[1] = back[1].replace(/ $/, '');
    return back;
  }
  niceStep = (interval: number) => {
    let step = (interval) / 3;
    let stepMag = 1;
    while (stepMag * step > 1) {
      stepMag /= 10;
    }
    while (stepMag * step < 1) {
      stepMag *= 10;
    }
    step = stepMag * step;
    if (step > 5) {
      step = 5;
    } else if (step > 2) {
      step = 2;
    } else if (step > 1) {
      step = 1;
    }
    step = Math.floor(step) / stepMag;
    return step;
  }
}
