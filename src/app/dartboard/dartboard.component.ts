import { Component, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { HIERACH } from '../app.component';

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css']
})

export class DartboardComponent {
  @Input() esgColour: {};

  colours: d3.ScaleLinear<d3.RGBColor, string>;
  eps = Math.abs((4 / 3 - 1) * 3 - 1);
  @Input() rotateok = true;
  @Input() topcolour = 'red';
  @Input() colourgamma = 0.75;
  @Input() title = 'DARTBOARD';
  @Input() smallgreytitle: string;
  @Input() ww = 600;
  offsetAngle: number;
  hh = this.ww;
  maxdepth = 0;
  driller = -1;
  piover180 = Math.PI / 180;
  margin = {
    top: 20,
    right: 90,
    bottom: 30,
    left: 90
  };
  width = this.ww - this.margin.left - this.margin.right;
  height = this.hh - this.margin.top - this.margin.bottom;
  radius = (Math.min(this.width, this.height) / 2) - 10;
  formatNumber = d3.format('0.2f');
  x = d3.scaleLinear().range([0, 2 * Math.PI]);
  y = d3.scaleLinear().range([0, this.radius]);
  private _picdata: d3.HierarchyRectangularNode<HIERACH>[];
  @Input() set picdata(k: d3.HierarchyRectangularNode<HIERACH>[]) {
    this._picdata = k;
    this.myChanges();
  }
  get picdata() {
    return this._picdata;
  }
  constructor(private element: ElementRef) { }
  translatehack = (a: number, b: number, r = 0) => `translate(${a},${b}) rotate(${r})`;
  abshack = (q: number) => Math.abs(q);

  myChanges() {
    console.log('changes');
    this.init();
    this.update();
  }
  init() {
    this.hh = 500;
    this.margin = {
      top: 20,
      right: 90,
      bottom: 30,
      left: 90
    };
    this.width = this.ww - this.margin.left - this.margin.right;
    this.height = this.hh - this.margin.top - this.margin.bottom;
    this.radius = (Math.min(this.width, this.height) / 2) - 10;
    this.x = d3.scaleLinear().range([0, 2 * Math.PI]);
    this.y = d3.scaleLinear().range([0, this.radius]);
    this.offsetAngle = (this.x(this.picdata[0].children[0].x0) + this.x(this.picdata[0].children[0].x1)) / 2;
    this.colours = d3.scaleLinear<d3.RGBColor>()
      .domain([0, this.picdata.length + 100])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb('white')])
      ;
    this.picdata.forEach(d => {
      this.maxdepth = Math.max(d.depth, this.maxdepth);
      this.driller = this.maxdepth;
    });
  }
  mouser(ee: MouseEvent, i: number, data: d3.HierarchyRectangularNode<HIERACH>, inout: true) {
    if (inout) {
      d3.select('app-root').select('div.mainTip')
        .style('opacity', 1)
        .style('display', 'inline-block')
        .style('left', `${ee.pageX + 10}px`)
        .style('top', `${ee.pageY + 10}px`)
        .html(() => (data.parent) ?
          `<i class='fa fa-dot-circle-o dotcircle'></i> ${data.parent.data.name === '' ? '' : data.parent.data.name + '<br>'}${data.data.name}<br>Value: ${this.formatNumber(data.value)}` :
          `<i class='fa fa-dot-circle-o dotcircle'></i> ${data.data.name === '' ? 'Total' : data.data.name}<br>Value:${this.formatNumber(data.value)}`);
    } else {
      d3.select('app-root').select('div.mainTip')
        .style('opacity', 0)
        .style('display', 'none');
    }
  }
  clicker(event: MouseEvent, d: d3.HierarchyRectangularNode<HIERACH>) {
    this.driller = d.height;
    console.log(this.driller);
    this.x.domain([d.x0, d.x1]);
    this.y
      .domain([d.y0, 1])
      .range([d.y0 ? 10 : 0, this.radius]);
    this.update();
  }
  arcCentroid(d: d3.HierarchyRectangularNode<HIERACH>) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC.centroid({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, this.y(d.y1)),
      startAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))),
      endAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))),
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  arcPath(d: d3.HierarchyRectangularNode<HIERACH>, t = 1) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, t * this.y(d.y1)),
      startAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x0))),
      endAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x1))),
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  boxDiag = (x: number, y: number) => Math.sqrt((x * x + y * y) / 2);
  update() {
    setTimeout(() => {
      d3.select(this.element.nativeElement).selectAll('path#face').data(this.picdata)
        .transition().duration(2000)
        .attrTween('d', d => t => this.arcPath(d, t));
      d3.select(this.element.nativeElement).selectAll('text#face').data(this.picdata)
        .transition().duration(2000)
        .text((d, i, j) => {
          const boxLength = this.y(d.y1) - this.y(d.y0) - 1;
          const side = (this.x(d.x1) - this.x(d.x0)) * (this.y(d.y0) + this.y(d.y1)) / 2;
          const here = j[i] as SVGTextElement;
          d3.select(here).text(d.data.name);
          const oldfont = 12; // parseFloat(d3.select(here).style('font-size'));
          const thick = (Math.min(side, oldfont));
          d3.select(here).style('font-size', `${thick}px`);
          let tLength = here.getComputedTextLength();
          d3.select(here).style('font-size', `${Math.max(5, thick)}px`);
          tLength = here.getComputedTextLength();
          let fixLength = Math.max(side, boxLength);
          if (!this.rotateok) {
            fixLength = boxLength;
          }
          if ((this.maxdepth === d.depth) || tLength >= fixLength) {
            let newLen = Math.floor(here.textContent.length * fixLength / (tLength));
            if (this.maxdepth === d.depth && this.driller > this.maxdepth - 2) {
              console.log(d.depth, d.height, this.maxdepth, this.driller);
              newLen = 2;
            }
            let text = '' + d.data.name.substring(0, newLen).replace(/ *$/, '');
            here.textContent = '' + text;
            text = '' + d.data.name.substring(0, newLen - 1).replace(/ *$/, '');
            if (false && here.getComputedTextLength() >= fixLength) {
              text = '' + d.data.name.substring(0, newLen - 1).replace(/ *$/, '');
              here.textContent = '' + text;
              //         console.log(text, here.getComputedTextLength(), fixLength);
            }
          }
          //const ang = +d3.select(here).attr('transform')
          // .replace(/.*rotate/, '').replace(/[\(,\)]/g, '');
          const ang = (this.abshack(this.arcCentroid(d)[0]) < 1e-8 
          && this.arcCentroid(d)[1] > 5 ? ((d.children && d.children.length) ? 180 : 90) : this.arcCentroid(d)[0] < 0 ? 90 : -90) + ((this.x(d.x0) + this.x(d.x1)) / 2) / this.piover180;

          if (this.rotateok && ((side - 10) > boxLength)) {
            // d3.select(here).attr('info', `${side} ${boxLength} ${ang} ${ang + (((ang + 360) % 360) > 270 ? 90 : -90)}`);
            d3.select(here).attr('transform', d3.select(here).attr('transform').replace(/rotate.*$/,
              `rotate(${ang + (((ang + 360) % 360) > 270 ? 90 : -90)})`));
          }
          if (here.getComputedTextLength() < side && Math.abs(this.arcCentroid(d)[0]) < 1e-8 && this.arcCentroid(d)[1] > 40) {
            d3.select(here).attr('transform', d3.select(here).attr('transform').replace(/rotate.*$/, 'rotate(0)'));
            d3.select(here).style('font-size', `${oldfont}px`);
          }
          return here.textContent;
        });
    });
  }
}
