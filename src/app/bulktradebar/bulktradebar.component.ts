import { Component, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bulktradebar',
  templateUrl: './bulktradebar.component.html',
  styleUrls: ['./bulktradebar.component.css']
})
export class BulktradebarComponent implements OnInit, OnChanges {

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
  @Input() animate = true;
  @Input() width = 600;
  @Input() height = 600;
  @Input() durationTime = 2000;
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
    const id = this.element.nativeElement;
    d3.select(id).select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    const RECTS = d3.select(id).select('svg').selectAll('rect');
    if (this.animate) {
      RECTS.transition().duration(this.durationTime).tween('kk', (d, i, j) => t => {
        const HERE = d3.select(j[i]);
        const oType = HERE.attr('class');
        const flag = this.counter[Math.floor(i / 3)];
        switch (oType) {
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
    this.toolTipObj.attr('style', `left:${ee.x + 20}px;top:${ee.y + 20}px;display:inline-block`)
      .html(`${name}<br>${type}<br>${value}`)
      .transition().duration(200)
      .styleTween('opacity', () => t => `${t * t}`);
  }
  onMouseLeave() {
    this.toolTipObj.attr('style', `display:none`)
      .html('').transition().duration(200).styleTween('opacity', () => t => `${1 - t * t}`);
  }
}
