import { Component, ElementRef, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HIERACH } from '../app.component';
export const eps = Math.abs((4 / 3 - 1) * 3 - 1);
@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.css']
})

export class DartboardComponent implements OnChanges, OnInit {
  piover180 = Math.PI / 180;
  gran = 0;
  dg = 0.1 * this.piover180;
  glow = 0;
  @Input() esgColour: {};
  colours: d3.ScaleLinear<d3.RGBColor, string>;
  @Input() picdata: d3.HierarchyRectangularNode<HIERACH>[];
  @Input() rotateok = true;
  @Input() useTwoChars = false;
  @Input() topcolour = 'red';
  @Input() colourgamma = 0.75;
  @Input() title = 'DARTBOARD';
  @Input() smallgreytitle: string;
  @Input() ww = 600;
  @Input() useOffset = true;
  offsetAngle: number;
  hh = this.ww;
  maxdepth = 0;
  driller = -1;
  margin = {
    top: 20,
    right: 90,
    bottom: 30,
    left: 90
  };
  width: number;
  height: number;
  radius: number;
  formatNumber = d3.format('0.2f');
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
  constructor(private element: ElementRef) { }
  formatG = (n: number) => d3.format('0.1f')(n);
  translatehack = (a: number, b: number, r = 0) => `translate(${a},${b}) rotate(${r})`;
  abshack = (q: number) => Math.abs(q);

  ngOnChanges(aaa: SimpleChanges) {
    //    console.log('changes');
    if (aaa.picdata !== undefined) {
      this.init();
      this.update();
    }
  }
  ngOnInit() {
    if (this.picdata !== undefined) {
      this.init();
      this.update();
    }
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
    //   console.log('radius', this.radius);
    this.x = d3.scaleLinear().range([0, 2 * Math.PI]);
    this.y = d3.scaleLinear().range([0, this.radius]);
    this.offsetAngle = !this.useOffset ? 0 : (this.x(this.picdata[0].children[0].x0) + this.x(this.picdata[0].children[0].x1)) / 2;
    this.colours = d3.scaleLinear<d3.RGBColor>()
      .domain([0, this.picdata.length + 100])
      .interpolate(d3.interpolateRgb.gamma(this.colourgamma))
      .range([d3.rgb(this.topcolour), d3.rgb('white')])
      ;
    this.picdata.forEach(d => {
      this.maxdepth = Math.max(d.depth, this.maxdepth);
      this.driller = this.maxdepth;
    });
    this.getGlow();
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
    let nez = d;
    if (nez.children === undefined || nez.children.length === 0) {
      this.offsetAngle = 0;
    } else {
      nez = nez.children[0];
      this.offsetAngle = !this.useOffset ? 0 : (this.x(nez.x0) + this.x(nez.x1)) / 2;
    }
    d3.select(this.element.nativeElement).selectAll('path#face').data(this.picdata)
      .style('opacity', 0);
    d3.select(this.element.nativeElement).selectAll('text#face').data(this.picdata)
      .style('opacity', 0);
    this.update();
  }
  arcCentroid(d: d3.HierarchyRectangularNode<HIERACH>, offs = 0) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC.centroid({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, this.y(d.y1)),
      startAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))) - offs,
      endAngle: Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))) - offs,
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  arcPath(d: d3.HierarchyRectangularNode<HIERACH>, t = 1) {
    const ARC = d3.arc().cornerRadius(d.depth >= 3 ? 3 : 1);
    return ARC({
      innerRadius: Math.max(0, this.y(d.y0) + 1),
      outerRadius: Math.max(0, t * this.y(d.y1)),
      startAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x0))) - this.offsetAngle,
      endAngle: Math.max(0, t * Math.min(2 * Math.PI, this.x(d.x1))) - this.offsetAngle,
      padAngle: 2e-2 / (2 * Math.PI)
    });
  }
  boxDiag = (x: number, y: number) => Math.sqrt((x * x + y * y) / 2);
  setgran() {
    console.log(this.gran);
    if (this.gran === 0) {
      this.gran = this.glow;
    } else {
      this.gran += this.dg;
    }
    //    this.update();
  }
  getGlow() {
    this.glow = 1e22;
    this.picdata.forEach(d => {
      if ((this.x(d.x1) - this.x(d.x0)) > 0) { this.glow = Math.min(this.x(d.x1) - this.x(d.x0), this.glow); }
    });
    this.dg = Math.max(this.dg, this.glow * 0.1);
  }
  update() {
    setTimeout(() => {
      d3.select(this.element.nativeElement).selectAll('path#face').data(this.picdata)
        .transition().duration(2000)
        .styleTween('opacity', () => t => `${t}`)
        .attrTween('d', (_, i, j) => t => {
          const propperI = +d3.select((j[i] as SVGTextElement).parentElement).attr('pindex');
          const d = this.picdata[propperI];
          return (d===undefined || (this.x(d.x1) - this.x(d.x0) <= this.gran)) ? '' : this.arcPath(d, t);
        });
      d3.select(this.element.nativeElement).selectAll('text#face').data(this.picdata)
        .transition().duration(2000)
        .styleTween('opacity', () => t => `${t}`)
        .text((_, i, j) => {
          const here = j[i] as SVGTextElement;
          const propperI = +d3.select(here.parentElement).attr('pindex');
          const d = this.picdata[propperI];
          const boxLength = this.y(d.y1) - this.y(d.y0) - 1;
          const side = (this.x(d.x1) - this.x(d.x0)) * (this.y(d.y0) + this.y(d.y1)) / 2;
          if (this.x(d.x1) - this.x(d.x0) < this.gran) {
            console.log('here', d.data.name, (this.x(d.x1) - this.x(d.x0)) * 180 / Math.PI);
            return ' ';
          }
          d3.select(here).text(d.data.name);
          const oldfont = 12;
          const thick = (Math.min(side, oldfont));
          d3.select(here).style('font-size', `${Math.max(5, thick)}px`);
          let fixLength = Math.min(side, boxLength);
          if (this.rotateok) {
            fixLength = boxLength;
          }
          let ang = (this.abshack(this.arcCentroid(d, this.offsetAngle)[0]) < 1e-8
            &&
            this.arcCentroid(d, this.offsetAngle)[1] > 5 ? ((d.children && d.children.length) ? 180 : 90) :
            this.arcCentroid(d, this.offsetAngle)[0] < 0 ? 90 : -90) +
            ((this.x(d.x0) + this.x(d.x1)) / 2) / this.piover180;


          ang -= this.offsetAngle / this.piover180;

          if (this.rotateok && (side - 10) > boxLength) {
            if (Math.abs(this.arcCentroid(d, this.offsetAngle)[0]) < 1e-8) { ang = 0; }
          }
          if (Math.abs(ang - 180) < 1e-6) { ang = 0; }
          if (Math.abs(this.x(d.x1) - this.x(d.x0) - Math.PI * 2) < 1e-8) {
            d3.select(here).attr('transform', this.translatehack(this.arcCentroid(d)[0], this.arcCentroid(d)[1]));
          } else {
            d3.select(here).attr('transform', d3.select(here).attr('transform').replace(/rotate.*$/, `rotate(${ang})`));
          }
          if (ang === 0 && Math.abs(this.arcCentroid(d, this.offsetAngle)[0]) < 1e-5) {
            fixLength = side;
          } else {
            fixLength = boxLength;
            if (this.x(d.x1) - this.x(d.x0) === Math.PI * 2) {
              fixLength = side;
            }
          }
          if ((this.maxdepth === d.depth) || here.getComputedTextLength() >= fixLength) {
            let newLen = Math.floor(d.data.name.length * fixLength / (here.getComputedTextLength())) - 0.5;
            if (this.useTwoChars && this.maxdepth === d.depth && this.driller > this.maxdepth - 2) {
              newLen = 2;
            }
            const text = '' + d.data.name.substring(0, newLen).replace(/ *$/, '');
            here.textContent = '' + text;
          }
          if (here.getComputedTextLength() < side &&
            Math.abs(this.arcCentroid(d, this.offsetAngle)[0]) < 1e-8 && this.arcCentroid(d, this.offsetAngle)[1] > 40) {
            d3.select(here).attr('transform', d3.select(here).attr('transform').replace(/rotate.*$/, 'rotate(0)'));
            d3.select(here).style('font-size', `${oldfont}px`);
          }
          return here.textContent;
        });
    }, 100);
  }
}
