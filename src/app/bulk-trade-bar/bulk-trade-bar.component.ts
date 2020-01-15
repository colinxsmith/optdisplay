import { Component, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bulk-trade-bar',
  templateUrl: './bulk-trade-bar.component.html',
  styleUrls: ['./bulk-trade-bar.component.css']
})
export class BulkTradeBarComponent implements OnInit, OnChanges {

  @Input() toolTipObj = d3.select('app-root').select('div.mainTip');
  DATA = {
    outlierStatusCounter: {
      title: 'Outlier Status Count',
      counter: [
        {
          name: 'RISK',
          outlier: 2,
          almostOutlier: 1,
          compliant: -1
        },
        {
          name: 'MHW',
          outlier: 2,
          almostOutlier: -10,
          compliant: -2
        },
        {
          name: 'CASH',
          outlier: -2,
          almostOutlier: -11,
          compliant: -1
        },
        {
          name: 'CONC',
          outlier: -2,
          almostOutlier: -7,
          compliant: 7
        }
      ]
    },
    preTradeMonitorFlags: {
      title: 'Pre TRADE FLAGS',
      monitorFlagRow: [
        {
          id: 1,
          type: 'stockLevelTotalRisk',
          label: 'RISK',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 18,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 1,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 1,
              outlierStatusType: 'OUTLIER'
            }
          ]
        },
        {
          id: 2,
          type: 'holdingExposureOutlier',
          label: 'MHW',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 28,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 10,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 4,
              outlierStatusType: 'OUTLIER'
            }
          ]
        },
        {
          id: 3,
          type: 'assetClassCash',
          label: 'CASH',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 22,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 12,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 3,
              outlierStatusType: 'OUTLIER'
            }
          ]
        },
        {
          id: 4,
          type: 'stockLevelConcentration',
          label: 'CONC',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 14,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 7,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 3,
              outlierStatusType: 'OUTLIER'
            }
          ]
        }
      ]
    },
    postTradeMonitorFlags: {
      title: 'Post TRADE FLAGS',
      monitorFlagRow: [
        {
          id: 1,
          type: 'stockLevelTotalRisk',
          label: 'RISK',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 17,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 2,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 3,
              outlierStatusType: 'OUTLIER'
            }
          ]
        },
        {
          id: 2,
          type: 'holdingExposureOutlier',
          label: 'MHW',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 16,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 0,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 6,
              outlierStatusType: 'OUTLIER'
            }
          ]
        },
        {
          id: 3,
          type: 'assetClassCash',
          label: 'CASH',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 20,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 1,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 1,
              outlierStatusType: 'OUTLIER'
            }
          ]
        },
        {
          id: 4,
          type: 'stockLevelConcentration',
          label: 'CONC',
          chartType: 'STATUS',
          monitorFlagCategory: [
            {
              id: 1,
              value: 21,
              outlierStatusType: 'NOT OUTLIER'
            },
            {
              id: 2,
              value: 0,
              outlierStatusType: 'ALMOST OUTLIER'
            },
            {
              id: 3,
              value: 1,
              outlierStatusType: 'OUTLIER'
            }
          ]
        }
      ]
    }
  };
  xScale = d3.scaleLinear();
  yScale = d3.scaleLinear();
  absHack = Math.abs;
  groupSpace = 0.25;
  barSpace = 0.3;
  myAttr = false;
  myTitle = false;
  @Input() bcolor = '';
  @Input() animate = true;
  @Input() width = 600;
  @Input() height = 600;
  @Input() durationTime = 2000;
  @Input() title = 'BULK CHANGE';
  @Input() counter: { name: string; outlier: number; almostOutlier: number; compliant: number; }[]
    = this.DATA.outlierStatusCounter.counter;
  constructor(private element: ElementRef) { }
  ngOnChanges() {
    this.setup();
    setTimeout(() => this.update());
  }
  ngOnInit() {
    this.setup();
    setTimeout(() => this.update());
  }
  setup() {
    if (this.bcolor === '') {
      this.bcolor = d3.select(this.element.nativeElement).style('background-color');
    }
    if (d3.select(this.element.nativeElement).attr('greentitle') === null &&
      d3.select(this.element.nativeElement).attr('smallgreytitle') === null) {
      d3.select(this.element.nativeElement).attr('greentitle', this.title);
    }
    if (d3.select(this.element.nativeElement).attr('greentitle') !== null) {
      this.title = d3.select(this.element.nativeElement).attr('greentitle');
      this.myTitle = true;
    }
    if (d3.select(this.element.nativeElement).attr('smallgreytitle') !== null) {
      this.title = d3.select(this.element.nativeElement).attr('smallgreytitle');
      this.myAttr = true;
    }
    let xMax = 0, xMin = 0;
    this.counter.forEach(d => {
      xMin = Math.min(d.almostOutlier, xMin);
      xMin = Math.min(d.compliant, xMin);
      xMin = Math.min(d.outlier, xMin);
      xMax = Math.max(d.almostOutlier, xMax);
      xMax = Math.max(d.compliant, xMax);
      xMax = Math.max(d.outlier, xMax);
    });
    this.xScale.domain([xMin, xMax]).rangeRound([0, this.width]);
    this.yScale.domain([0, this.counter.length]).rangeRound([0.1 * this.height, this.height * 0.9]);
  }
  translateHack(w: number, h: number) {
    return `translate(${w},${h})`;
  }
  update() {
    const id = this.element.nativeElement as HTMLElement;
    d3.select(id).select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const RECTS = d3.select(id).select('svg').selectAll('rect');
    if (this.animate) {
      RECTS.transition().duration(this.durationTime).tween('kk', (d, i, j) => t => {
        const HERE = d3.select(j[i]);
        const oType = HERE.attr('class').split(' ')[0];
        const flag = this.counter[Math.floor(i / 4)];
        switch (oType) {
          case 'group':
            HERE.attr('x', t * t * this.xScale.range()[0] + (1 - t) * this.width / 2);
            HERE.attr('width', t * (this.xScale.range()[1] - this.xScale.range()[0]));
            break;
          case 'N':
            HERE.attr('width', t * this.absHack(this.xScale(flag.compliant) - this.xScale(0)));
            HERE.attr('x', (flag.compliant < 0 ? this.xScale(t * flag.compliant) : this.xScale(0)));
            break;
          case 'O':
            HERE.attr('width', t * this.absHack(this.xScale(flag.outlier) - this.xScale(0)));
            HERE.attr('x', (flag.outlier < 0 ? this.xScale(t * flag.outlier) : this.xScale(0)));
            break;
          case 'A':
            HERE.attr('width', t * this.absHack(this.xScale(flag.almostOutlier) - this.xScale(0)));
            HERE.attr('x', (flag.almostOutlier < 0 ? this.xScale(t * flag.almostOutlier) : this.xScale(0)));
            break;
        }
        return '';
      });
    }

  }
  onMouseEnter(name: string, value: number, type: string, ee: MouseEvent) {
    const ww = (ee.x - (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().left)
      /  (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().width;
    const hh = (ee.y - (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().top)
      /  (d3.select(this.element.nativeElement).select('svg').node() as HTMLElement).getBoundingClientRect().height;
//    console.log(ww, hh);
    d3.select(this.element.nativeElement).style('--xx', `${100 * ww}%`);
    d3.select(this.element.nativeElement).style('--yy', `${100 * hh}%`);
    d3.select(this.element.nativeElement).style('--back', 'blue');
    d3.select(this.element.nativeElement).attr('title', `${ee.x},${ee.y}`);
    if (this.myAttr) {
      d3.select(this.element.nativeElement).attr('smallgreytitle', `${ee.pageX},${ee.pageY}`);
    }
    if (this.myTitle) {
      d3.select(this.element.nativeElement).attr('greentitle', `${ee.pageX},${ee.pageY}`);
    }
    this.toolTipObj.attr('style', `left:${ee.x + 20}px;top:${ee.y + 20}px;display:inline-block`)
      .html(`${name}<br>${type}<br>${value}`)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${t * t}`);
  }
  onMouseLeave() {
    d3.select(this.element.nativeElement).style('--xx', '0%');
    d3.select(this.element.nativeElement).style('--yy', '0%');
    d3.select(this.element.nativeElement).style('--back', 'red');
    d3.select(this.element.nativeElement).attr('title', this.title);
    if (this.myAttr) {
      d3.select(this.element.nativeElement).attr('smallgreytitle', this.title);
    }
    if (this.myTitle) {
      d3.select(this.element.nativeElement).attr('greentitle', this.title);
    }
    this.toolTipObj.attr('style', `display:none`)
      .html('').transition().duration(200).styleTween('opacity', () => t => `${1 - t * t}`);
  }
}
