import { Component, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { isNumber, isNull } from 'util';
@Component({
  selector: 'app-bubbletable',
  templateUrl: './bubbletable.component.html',
  styleUrls: ['./bubbletable.component.css']
})
export class BubbletableComponent implements OnInit, OnChanges {
  @Input() DATA: any = [];
  @Input() width = 800;
  @Input() height = 800;
  @Input() borderX = 100;
  @Input() borderY = 100;
  @Input() fontSize = 20;
  @Input() circles = true;
  @Input() squares = true;
  @Input() squareRotate = 60;
  @Input() pathRotate = 45;
  @Input() labelYRotate = 270;
  @Input() paths = true;
  @Input() animDuration = 2000;
  @Input() tip = d3.select('app-root').select('div.mainTip');
  getKeys = Object.keys;
  keys: string[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  leftLabel: string[] = [];
  leftLabelA: string[][] = [];
  leftLabelFontSize = 16;
  radScale: d3.ScaleLinear<number, number>;
  radarLine: d3.LineRadial<number>;
  format = d3.format('0.3');
  dataOrder: number[];
  updateCount = 0;
  pathScale: (t: number) => string;
  circleScale: (t: number) => string;
  squareScale: (t: number) => string;
  isNumberHack = isNumber;
  absHack = Math.abs;
  constructor(private element: ElementRef) {
  }
  vertexLine = (t: number) => [t, t / 3, t, t / 2, t, t / 2, t, t / 3];
  getIdHack = (x: number, y: number) => `${x},${y}`;

  translateHack = (x: number, y: number, r = 0) => `translate(${x},${y}) rotate(${r})`;
  transDATA = (ii: number) => this.DATA[this.dataOrder[ii]];
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
  setup() {
    if (!this.DATA.length) {
      for (let i = 0; i < 7; ++i) {
        this.DATA.push({
          name: `name${i + 1}`, x: i, y: i * i, z: i * i * (i - 5.5),
          sin: +this.format(Math.sin(i) * 60), cos: +this.format(Math.cos(i) * 60), tan: +this.format(Math.tan(i) * 60)
        });
      }
      this.DATA.forEach((d, i) => {
        this.leftLabel.push(d.name + ` ${i} label test for wrapping`);
      });
      this.keys = this.getKeys(this.DATA[0]);
      this.width = this.keys.length * this.fontSize * this.DATA[this.DATA.length - 1][this.keys[0]].length;
      this.height = this.DATA.length * this.fontSize * 4;
    }
    this.dataOrder = Array(this.DATA.length);
    for (let i = 0; i < this.dataOrder.length; ++i) {
      this.dataOrder[i] = i;
    }
    this.keys = this.getKeys(this.DATA[0]);
    this.xScale = d3.scaleLinear().domain([0, this.getKeys(this.DATA[0]).length + 1]).range([0, this.width - this.borderX * 2]);
    this.yScale = d3.scaleLinear().domain([0, this.DATA.length + 1]).range([0, this.height - this.borderY * 2]);
    let dm = 0, dM = 0, am = 0, aM = 0;
    this.DATA.forEach(d => {
      this.getKeys(d).forEach(dd => {
        if (this.isNumberHack(d[dd])) {
          dm = Math.min(dm, d[dd]);
          dM = Math.max(dM, d[dd]);
          am = Math.min(am, Math.abs(d[dd]));
          aM = Math.max(aM, Math.abs(d[dd]));
        }
      });
    });
    const cScale = (k: number) => (k - dm) / (dM - dm);
    this.pathScale = (t: number) => {
      //    const back = (d3.interpolateRgb('cyan', 'purple'))(cScale(t));
      // optimizer compiler reports t.rgb() not a funtcion, use --build-optimizer=false in build
      // so I wrote my own interpolate function which avoids d3.rgb()
      const back = this.colourInterpolate('cyan', 'purple', cScale(t));
      return back;
    };
    this.circleScale = (t: number) => {
      const back = this.colourInterpolate('red', 'blue', cScale(t));
      return back;
    };
    this.squareScale = (t: number) => {
      const back = this.colourInterpolate('yellow', 'orange', cScale(t));
      return back;
    };
    this.radScale = d3.scaleSqrt().domain([am, aM]).range([0, this.yScale(0.5)]);
    const angScale = d3.scaleLinear().domain([0, this.vertexLine(1).length]).range([0, Math.PI * 2]);
    this.radarLine = d3.lineRadial<number>()
      .curve(d3.curveCardinalClosed)
      .radius(d => d)
      .angle((d, i) => angScale(i));
    const newWidth = 2 * this.yScale(1) / 12;  // 12 is label font-size
    if (this.leftLabel.length) {
      this.leftLabelA = this.wrapLabels(this.leftLabel, newWidth);
    }
  }
  update() {
    this.updateCount++;
    console.log('update count', this.updateCount);
    this.keys = this.getKeys(this.DATA[0]);
    this.xScale = d3.scaleLinear().domain([0, this.getKeys(this.DATA[0]).length + 1]).range([0, this.width - this.borderX * 2]);
    this.yScale = d3.scaleLinear().domain([0, this.DATA.length + 1]).range([0, this.height - this.borderY * 2]);
    this.fontSize = +d3.select(this.element.nativeElement).select('#BUBBLE').select('.table').style('font-size').replace('px', '');
    if (this.circles) {
      const circleTable = d3.select(this.element.nativeElement).select('#BUBBLE').selectAll('circle.table');
      circleTable.transition().duration(this.animDuration)
        .tween('circleText', (d, i, j: Array<SVGCircleElement>) => t => {
          const here = d3.select(j[i]);
          const ij = here.attr('ij');
          here.attr('cx', (t * (1 - t) + 1) * this.xScale(+ij.split(',')[0] + 1));
          here.attr('cy', (1 - t) * this.height * 0.95 + t * this.yScale(+ij.split(',')[1] + 1));
        });
    }
    if (this.squares) {
      const squareTable = d3.select(this.element.nativeElement).select('#BUBBLE').selectAll('rect.table');
      squareTable.transition().duration(this.animDuration)
        .tween('squareText', (d, i, j: Array<SVGRectElement>) => t => {
          const here = d3.select(j[i]);
          const ij = here.attr('ij');
          here.attr('transform', this.translateHack(this.xScale(+ij.split(',')[0] + 1), t * this.yScale(+ij.split(',')[1] + 1),
            this.squareRotate * t));
        });
    }
    if (this.paths) {
      const pathTable = d3.select(this.element.nativeElement).select('#BUBBLE').selectAll('path.table');
      pathTable.transition().duration(this.animDuration)
        .tween('pathText', (d, i, j: Array<SVGPathElement>) => t => {
          const here = d3.select(j[i]);
          const ij = here.attr('ij');
          here.attr('transform', this.translateHack(this.xScale(+ij.split(',')[0] + 1),
            (t * (1 - t) + 1) * this.yScale(+ij.split(',')[1] + 1), this.pathRotate * t));
        });
    }
    const textTable = d3.select(this.element.nativeElement).select('#BUBBLE').selectAll('text.table');
    textTable.transition().duration(this.animDuration)
      .tween('tabtext', (d, i, j: Array<SVGTextElement>) => t => {
        const here = d3.select(j[i]);
        const ij = here.attr('ij');
        here.attr('transform', `translate(0,${this.yScale(+ij.split(',')[1] + 1) + this.fontSize / 4}) rotate(${-45 * (1 - t)})`);
      });
    const labelY = d3.select(this.element.nativeElement).select('#BUBBLE').selectAll('text.labelY');
    //  labelY.call(this.textFind);
    labelY.transition().duration(this.animDuration)
      .tween('labYtext', (d, i, j: Array<SVGTextElement>) => t => {
        const here = d3.select(j[i]);
        here.attr('transform', `${this.translateHack(- (this.labelYRotate ? this.borderX : this.borderX / 2),
          this.yScale(i + 1) - this.borderY / 4,
          t * this.labelYRotate)}`);
      });
  }
  textEnter(i: number, col: string, ev: MouseEvent) {
    this.tip.attr('style', `left:${ev.x + 20}px;top:${ev.y + 20}px;display:inline-block`)
      .html(`${this.dataOrder[i] + 1}<br>${col}<br>${this.DATA[this.dataOrder[i]][col]}`)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${t * t}`);
  }
  textLeave() {
    this.tip.attr('style', `display:none`)
      .html(``)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${1 - t * t}`);
  }
  labelEnter(i: number, label: string, ev: MouseEvent) {
    this.tip.attr('style', `left:${ev.x + 20}px;top:${ev.y + 20}px;display:inline-block`)
      .html(`${label}`)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${t * t}`);
  }
  labelLeave() {
    this.tip.attr('style', `display:none`)
      .html(``)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${1 - t * t}`);
  }
  textClick(xpos: number, ypos: number) {
    const textTable = d3.select(this.element.nativeElement).select('#BUBBLE').selectAll('text.table').nodes() as SVGTextElement[];
    const tspanTable = d3.select(textTable[ypos]).selectAll('tspan').nodes()[xpos] as SVGTSpanElement;
    if (this.isNumberHack(this.DATA[ypos][d3.select(tspanTable).attr('class')])) {
      const key = d3.select(tspanTable).attr('class');
      for (let i = 0; i < this.dataOrder.length; ++i) {
        this.dataOrder[i] = i;
      }
      this.dataOrder.sort((d1, d2) => {
        if (this.DATA[d1][key] < this.DATA[d2][key]) {
          return 1;
        } else if (this.DATA[d1][key] === this.DATA[d2][key]) {
          return 0;
        } else {
          return -1;
        }
      });
    } else {
      for (let i = 0; i in this.dataOrder; ++i) {
        this.dataOrder[i] = i;
      }
    }
    this.update();
  }
  rectClick(ev: MouseEvent) {
    if (this.width - this.borderX < ev.pageX + 10) {
      this.width = ev.pageX + 10 + this.borderX;
    }
    if (this.height - this.borderY < ev.pageY + 10) {
      this.height = ev.pageY + 10 + this.borderY;
    }
    this.update();

    const node = d3.select('#BUBBLE').select('text.labelY');
    const newWidth = this.yScale(1) / +node.style('font-size').replace('px', '') * 2;
    this.leftLabelA = this.wrapLabels(this.leftLabel, newWidth);
  }
  wrapLabels = (labS: string[], mW: number) => {
    console.log('wrapLabels', mW);
    const labA: string[][] = [];
    if (labS.length > 0) {
      labS.forEach((d, i) => {
        labA.push(this.wrapString(d, mW));
      });
    }
    return labA;
  }
  wrapString = (d: string, mW: number) => {
    const newd: string[] = [];
    let word = '';
    let line = '';
    const words = d.split(' ').reverse();
    while (word = words.pop()) {
      if (line.length + word.length > mW) {
        newd.push(line);
        line = '';
      }
      line += word;
      line += ' ';
    }
    if (line.length) {
      newd.push(line.substring(0, mW));
    }
    return newd;
  }
  textFind = (ddd: any) => ddd.each((_kk, i, j) => {
    const node = d3.select(j[i]);
    const spans = node.selectAll('tspan').nodes() as SVGTSpanElement[];
    spans.forEach(span => {
      console.log(span.getComputedTextLength());
      console.log(span.textContent);
      console.log(span.textContent.length, 'Average font-size ' + (span.getComputedTextLength() / span.textContent.length));
      console.log(d3.select(span.parentNode).style('font-size'));
    });
  })
  colourInterpolate = (c1: string, c2: string, t: number) => {
    const r = (d3.color(c1) as d3.RGBColor).r * t + (d3.color(c2) as d3.RGBColor).r * (1 - t);
    const g = (d3.color(c1) as d3.RGBColor).g * t + (d3.color(c2) as d3.RGBColor).g * (1 - t);
    const b = (d3.color(c1) as d3.RGBColor).b * t + (d3.color(c2) as d3.RGBColor).b * (1 - t);
    const back = `rgb(${r}, ${g}, ${b})`;
    return back;
  }
}
