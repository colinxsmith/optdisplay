import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-newgauge',
  templateUrl: './newgauge.component.html',
  styleUrls: ['./newgauge.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewgaugeComponent implements OnInit {

  toolTipObj = d3.select(this.mainScreen.nativeElement).append('g').attr('class', 'tooltip');
  duration = 3000; // duration time in ms for animations
  chartSide = 100; // each chart is 100px by 100px

  // Mock data for the bulk trade charts
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
  constructor(private mainScreen: ElementRef) { }

  ngOnInit() {

    // The positions for the charts are set out in the html file. There is a div with id chartholder which holds
    // 9 svgs gaugepre1,2,3 and 4, barchart and gaugepost1,2,3 and 4.
    // each chart is contained in a square of side 100px. (this.chartSide)

    d3.select('#chartholder').attr('style', `height:${this.chartSide}px;width:${this.chartSide * 9}px`);
    this.DATA.preTradeMonitorFlags.monitorFlagRow.forEach(d =>
      this.chart(d, this.chartSide, '#chartholder', '#gaugepre', this.DATA.preTradeMonitorFlags.title));
    const bardata = this.DATA.outlierStatusCounter.counter;
    this.barplot(bardata, this.chartSide * 0.9, '#chartholder', '#barchart', this.DATA.outlierStatusCounter.title);
    this.DATA.postTradeMonitorFlags.monitorFlagRow.forEach(d =>
      this.chart(d, this.chartSide, '#chartholder', '#gaugepost', this.DATA.postTradeMonitorFlags.title));
  }

  barplot(barChartData: {
    name: string;
    outlier: number;
    almostOutlier: number;
    compliant: number;
  }[], side: number, id: string, bars: string, title: string) {
    // Plots the data in barChartData as horizontal bars in a square side px by side px.
    // id is the name of the chart's container and bars is its SVG.
    // title is written to the tooltip.

    const SVG = d3.select(id).select(`${bars}`)
      .attr('width', side)
      .attr('height', side);
    SVG.selectAll('rect').remove();
    SVG.append('rect')
      .attr('class', 'border')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', side)
      .attr('height', side);
    let xMin = d3.min(barChartData.map(d => Math.min(d.outlier, Math.min(d.almostOutlier, d.compliant))));
    let xMax = d3.max(barChartData.map(d => Math.max(d.outlier, Math.max(d.almostOutlier, d.compliant))));
    if (xMax < 0) {
      xMax = 0;
    }
    if (xMin > 0) {
      xMin = 0;
    }
    const barScale = d3.scaleLinear().domain([xMin, xMax]).range([- side / 2, side / 2]);
    console.log(barChartData.map(d => (d.outlier)));
    console.log(barChartData.map(d => barScale(d.outlier)));
    console.log(barScale(0));
    const gap = side * 0.6;
    SVG.selectAll('.bars1').data(barChartData).enter()
      .append('rect')
      .attr('id', 'casedef')
      .attr('transform', (d, i) => `translate(${side / 2},${(2 * (side - gap) / 3 + gap / 2 + side * i) / barChartData.length})`)
      .attr('y', 0)
      .attr('height', (side - gap) / 3 / barChartData.length)
      .attr('x', d => d.outlier < 0 ? barScale(d.outlier) - barScale(0) : 0)
      .attr('width', d => d.outlier < 0 ? barScale(0) - barScale(d.outlier) : barScale(d.outlier))
      .on('mousemove', d => {
        this.toolTipObj.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
          .html(`${title}<br>${d.name}<br>${d.outlier}`);
      })
      .on('mouseout', () => {
        this.toolTipObj.attr('style', `display:none`)
          .html('');
      })
      .transition().duration(this.duration)
      .attrTween('x', d => t => `${d.outlier < 0 ? (barScale(d.outlier) - barScale(0)) * t : 0}`)
      .attrTween('width', d => t => `${d.outlier < 0 ? t * (barScale(0) - barScale(d.outlier)) :
        t * barScale(d.outlier)}`)
      ;
    SVG.selectAll('.bars2').data(barChartData).enter()
      .append('rect')
      .attr('id', 'case2')
      .attr('transform', (d, i) => `translate(${side / 2},${(0 * (side - gap) / 3 + gap / 2 + side * i) / barChartData.length})`)
      .attr('y', 0)
      .attr('height', (side - gap) / 3 / barChartData.length)
      .attr('x', d => d.compliant < 0 ? barScale(d.compliant) - barScale(0) : 0)
      .attr('width', d => d.compliant < 0 ? barScale(0) - barScale(d.compliant) : barScale(d.compliant))
      .on('mousemove', d => {
        this.toolTipObj.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
          .html(`${title}<br>${d.name}<br>${d.compliant}`);
      })
      .on('mouseout', () => {
        this.toolTipObj.attr('style', `display:none`)
          .html('');
      })
      .transition().duration(this.duration)
      .attrTween('x', d => t => `${d.compliant < 0 ? (barScale(d.compliant) - barScale(0)) * t : 0}`)
      .attrTween('width', d => t => `${d.compliant < 0 ? t * (barScale(0) - barScale(d.compliant)) :
        t * barScale(d.compliant)}`)
      ;
    SVG.selectAll('.bars3').data(barChartData).enter()
      .append('rect')
      .attr('id', 'case13')
      .attr('transform', (d, i) => `translate(${side / 2},${((side - gap) / 3 + gap / 2 + side * i) / barChartData.length})`)
      .attr('y', 0)
      .attr('height', (side - gap) / 3 / barChartData.length)
      .attr('x', d => d.almostOutlier < 0 ? barScale(d.almostOutlier) - barScale(0) : 0)
      .attr('width', d => d.almostOutlier < 0 ? barScale(0) - barScale(d.almostOutlier) : barScale(d.almostOutlier))
      .on('mousemove', d => {
        this.toolTipObj.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
          .html(`${title}<br>${d.name}<br>${d.almostOutlier}`);
      })
      .on('mouseout', () => {
        this.toolTipObj.attr('style', `display:none`)
          .html('');
      })
      .transition().duration(this.duration)
      .attrTween('x', d => t => `${d.almostOutlier < 0 ? (barScale(d.almostOutlier) - barScale(0)) * t : 0}`)
      .attrTween('width', d => t => `${d.almostOutlier < 0 ? t * (barScale(0) - barScale(d.almostOutlier)) :
        t * barScale(d.almostOutlier)}`)
      ;
  }
  chart(oneChartData: {
    id: number;
    type: string;
    label: string;
    chartType: string;
    monitorFlagCategory: {
      id: number;
      value: number;
      outlierStatusType: string;
    }[];
  }, side: number, id: string, gauge: string, title: string) {

    // Plots the data in oneChartData as an "arc chart" in a square side px by side px.
    // id is the name of the chart's container and gaugeoneChartData.id is its SVG.
    // title is written to the tooltip.

    const rimData = oneChartData.monitorFlagCategory.map(d => d.value);
    const innerNumbers = oneChartData.monitorFlagCategory.map(d => d.value);
    const gTitle = oneChartData.label;
    const divSquare = side * 7 / 5;
    const rimDef = side / 10, rimFont = side / 10;
    let sumRim = 0, sofar = 0;
    rimData.forEach(d => {
      sumRim += d;
    });
    const arcScale = d3.scaleLinear()
      .domain([0, sumRim])
      .range([(180 + rimDef) / 360 * Math.PI * 2, (180 + 360 - rimDef) / 360 * Math.PI * 2]);
    const gaugeSVG = d3.select(id).select(`${gauge}${oneChartData.id}`);
    gaugeSVG.attr('width', side).attr('height', side);
    gaugeSVG.selectAll('path').remove();
    gaugeSVG.selectAll('text').remove();
    gaugeSVG.selectAll('.rims').data(oneChartData.monitorFlagCategory).enter()
      .append('path')
      .attr('class', 'gauge')
      .attr('transform', `translate(${side / 2},${side / 2})`)
      .attr('id', (d, i) => {
        switch (d.outlierStatusType) {
          case 'NOT OUTLIER': return 'case2';
          case 'ALMOST OUTLIER': return 'case13';
          case 'OUTLIER': return 'casedef';
          default: return 'casered';
        }
      })
      .on('mousemove', d => {
        this.toolTipObj.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
          .html(`${title}<br>${d.outlierStatusType}<br>${d.value}`);
      })
      .on('mouseout', () => {
        this.toolTipObj.attr('style', `display:none`)
          .html('');
      })
      .transition().duration(this.duration)
      .attrTween('d', d => {
        const s = sofar;
        sofar += d.value;
        return (t) => {
          const aDat = {
            innerRadius: side / 2 * 0.7 * t,
            outerRadius: side / 2 * 0.8,
            padAngle: 1 - t * t,
            startAngle: arcScale(s) * t * t,
            endAngle: arcScale(sofar) * t * t
          };
          const back = d3.arc();
          back.cornerRadius(side * 0.1 * (1 - t));
          return back(aDat);
        };
      });
    gaugeSVG.selectAll('.inners').data(innerNumbers).enter()
      .append('text')
      .attr('class', 'gauge')
      .style('font-size', `${rimFont}px`)
      .transition().duration(this.duration).ease(d3.easeBounce)
      .attrTween('transform', (d, i) => (t) => `translate(${side / 2},${side / 2 + t * t * rimFont * 2 * (i - 1)})`)
      .text(d => d);
    const titleText = gaugeSVG.append('text')
      .attr('class', 'gaugeT')
      .attr('transform', `translate(${side / 2},${side - rimFont})`)
      .style('font-size', `${divSquare / 10}`)
      .text(gTitle);
    titleText
      .transition().duration(this.duration)
      .attrTween('transform', () => (t) =>
        `translate(${side / 2},${side * t}) rotate(${360 * t})`);
  }
}
