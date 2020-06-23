import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
interface AXISDATA { axis: string; value: number; }
@Component({
  selector: 'app-flower',
  templateUrl: './flower.component.html',
  styleUrls: ['./flower.component.css']
})
export class FlowerComponent implements OnChanges {
  @Input() flowernames: string[];
  @Input() flowerfinal: number[];
  @Input() flowerinitial: number[];
  @Input() flowerradius = 300;
  @Input() scaleExp = 0.1;
  @Input() animate = true;
  @Input() sticks = true;
  @Input() flowerId = 'flowerchart';
  @Input() flowerTitle = 'Optimised Portfolio Changes';
  negativeValues = false;
  flower1: Array<AXISDATA>;
  flower2: Array<AXISDATA>;
  neworder: number[] = [];
  Cos = Math.cos;
  Sin = Math.sin;
  cutOff = 1e-8;
  angleTop: number;
  flowerRim = this.flowerradius / 4;
  rScale: d3.ScalePower<number, number>;
  angleScaleBase: d3.ScaleLinear<number, number>;
  radarLine = d3.lineRadial<AXISDATA>()
    .curve(d3.curveCardinalClosed)
    .radius((d) => this.rScale(d.value))
    .angle((d, i) => this.angleScale(i));
  radarLineZ = d3.lineRadial<AXISDATA>()
    .curve(d3.curveCardinalClosed)
    .radius((d) => this.rScale(0))
    .angle((d, i) => this.angleScale(-i));
  constructor(private element: ElementRef) { }
  ngOnChanges() {
    this.Init();
  }
  Init() {
    console.log(this.flowernames);
    this.neworder = [];
    this.flower1 = this.flowernames.map((x, i) => {
      return { axis: x, value: this.flowerfinal[i] };
    });
    this.flower2 = this.flowernames.map((x, i) => {
      return { axis: x, value: this.flowerinitial[i] };
    });
    this.flower1.forEach((x, i) => {
      this.neworder.push(i);
    });
    this.rScale = d3.scalePow()
      .exponent(this.scaleExp)
      .domain([
        Math.max(d3.min(this.flower1.map(x => x.value)),
          d3.min(this.flower2.map(x => x.value))),
        Math.max(d3.max(this.flower1.map(x => x.value)),
          d3.max(this.flower2.map(x => x.value)))
      ]).range([0, this.flowerradius]);
    this.neworder.sort((i, j) => {
      if (this.flower1[i].value < this.flower1[j].value) {
        return 1;
      } else if (this.flower1[i].value === this.flower1[j].value) {
        return 0;
      } else {
        return -1;
      }
    });
    let interim = [], findZero = -1;
    this.neworder.forEach((x, i) => {
      if (findZero === -1 && (Math.abs(this.flower1[this.neworder[i]].value) < 1e-12)) {
        findZero = i;
      }
      interim.push(this.flower1[this.neworder[i]]);
      if (this.sticks) {
        interim.push({ axis: '', value: 0 });
      }
    });
    interim.forEach((x, i) => {
      this.flower1[i] = interim[i];
    });
    if (findZero === -1) {
      findZero = this.neworder.length - 1;
    }
    findZero = Math.max(findZero, 4);
    interim = [];
    this.neworder.forEach((x, i) => {
      interim.push(this.flower2[this.neworder[i]]);
      if (this.sticks) {
        interim.push({ axis: '', value: 0 });
      }
    });
    interim.forEach((x, i) => {
      this.flower2[i] = interim[i];
    });
    if (this.sticks) {
      findZero *= 2;
    }
    this.angleTop = findZero;
    this.negativeValues = this.rScale.domain()[0] < 0;
    this.angleScaleBase = d3.scaleLinear().domain([0, this.angleTop - 1]).range([0, Math.PI * 2]);
    setTimeout(() => {
      this.update();
    });
  }
  translatehack = (x: number, y: number, r = 0) => `translate(${x},${y}) rotate(${r})`;
  formatF = (i: number) => d3.format('0.2%')(i);
  angleScale = (a: number) => this.angleScaleBase(a % this.angleTop);
  flowerLabel = (y1: number, x1 = -this.flowerradius, s1 = 20) => `M${x1},${y1 - this.flowerradius + this.flowerRim - s1 * 0.75}l0,${s1}l${s1},0l0,-${s1}z`;
  update() {
    if (this.animate) {
      d3.select(this.element.nativeElement).selectAll('#PetalC')
        .transition().duration(3000).ease(d3.easeBounce)
        .attrTween('transform', () => t => `rotate(${-t * 360})`);
      d3.select(this.element.nativeElement).selectAll('#PetalP')
        .transition().duration(3000).ease(d3.easeBounce)
        .attrTween('transform', () => t => `rotate(${t * 360})`);
    }
  }
  petal(ee: MouseEvent, inout: boolean) {
    const here = d3.select(ee.target as SVGGElement);
    here.style('opacity', inout ? 0.75 : 0.5);
  }
  circlab(ee: MouseEvent, circ: AXISDATA, inout: boolean, label = '') {
    if (inout) {
      d3.select('app-root').select('div.mainTip')
        .style('opacity', 1)
        .style('display', 'inline-block')
        .style('left', `${ee.pageX + 10}px`)
        .style('top', `${ee.pageY + 10}px`)
        .html(() => `<i class='fa fa-dot-circle-o dotcircle'></i> ${label}<br>${circ.axis}<br>${this.formatF(circ.value)}`);
    } else {
      d3.select('app-root').select('div.mainTip')
        .style('opacity', 0)
        .style('display', 'none');
    }
  }
}
