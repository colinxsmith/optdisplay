import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-newgauge',
  templateUrl: './newgauge.component.html',
  styleUrls: ['./newgauge.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewgaugeComponent implements OnInit {

  tTip = d3.select('app-disp').append('g').attr('class', 'tooltip');


  DATA = {
    outlierStatusCounter: {
      title: 'Post TRADE FLAGS',
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
  constructor() { }


  ngOnInit() {
    const chartRadius = 100;
    d3.select('#chartholder').attr('style', `height:${chartRadius}px;width:${chartRadius * 9}px`);
    this.DATA.preTradeMonitorFlags.monitorFlagRow.forEach(d => this.chart(d, chartRadius, '#chartholder', '#gaugepre'));
    const bardata = this.DATA.outlierStatusCounter.counter;
    this.stockbars(bardata.map(d => {
      return { axis: d.name, value: d.compliant, alpha: d.almostOutlier };
    }), 1, 100, 100, 2000);
    this.DATA.postTradeMonitorFlags.monitorFlagRow.forEach(d => this.chart(d, chartRadius, '#chartholder', '#gaugepost'));
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
  }, gaugeR = 300, id = '#scl', gauge = '#gauge') {
    const rimData = oneChartData.monitorFlagCategory.map(d => d.value);
    const innerNumbers = oneChartData.monitorFlagCategory.map(d => d.value);
    const gTitle = oneChartData.label;
    const divSquare = gaugeR * 7 / 5;
    const rimDef = gaugeR / 10, rimFont = gaugeR / 10;
    let sumRim = 0, sofar = 0;
    rimData.forEach(d => {
      sumRim += d;
    });
    const arcScale = d3.scaleLinear()
      .domain([0, sumRim])
      .range([(180 + rimDef) / 360 * Math.PI * 2, (180 + 360 - rimDef) / 360 * Math.PI * 2]);
    const gaugeSVG = d3.select(id).select(`${gauge}${oneChartData.id}`);
    gaugeSVG.attr('width', gaugeR).attr('height', gaugeR);
    gaugeSVG.selectAll('path').remove();
    gaugeSVG.selectAll('text').remove();
    gaugeSVG.selectAll('.rims').data(oneChartData.monitorFlagCategory).enter()
      .append('path')
      .attr('class', 'gauge')
      .attr('transform', `translate(${gaugeR / 2},${gaugeR / 2})`)
      .attr('id', (d, i) => {
        switch (d.outlierStatusType) {
          case 'NOT OUTLIER': return 'case2';
          case 'ALMOST OUTLIER': return 'case13';
          case 'OUTLIER': return 'casedef';
          default: return 'casered';
        }
      })
      .on('mousemove', d => {
        this.tTip.attr('style', `left:${d3.event.pageX + 20}px;top:${d3.event.pageY + 20}px;display:inline-block`)
          .html(`<i class='fa fa-weibo leafy'></i> ${d}`);
      })
      .on('mouseout', () => {
        this.tTip.attr('style', `display:none`)
          .html('');
      })
      .transition().duration(5000)
      .attrTween('d', d => {
        const s = sofar;
        sofar += d.value;
        return (t) => {
          const aDat = {
            innerRadius: gaugeR / 2 * 0.7 * t,
            outerRadius: gaugeR / 2 * 0.8,
            padAngle: 1 - t * t,
            startAngle: arcScale(s) * t * t,
            endAngle: arcScale(sofar) * t * t
          };
          const back = d3.arc();
          back.cornerRadius(gaugeR * 0.1 * (1 - t));
          return back(aDat);
        };
      });
    gaugeSVG.selectAll('.inners').data(innerNumbers).enter()
      .append('text')
      .attr('class', 'gauge')
      .style('font-size', `${rimFont}px`)
      .transition().duration(5000).ease(d3.easeBounce)
      .attrTween('transform', (d, i) => (t) => `translate(${gaugeR / 2},${gaugeR / 2 + t * t * rimFont * 2 * (i - 1)})`)
      .text(d => d);
    const titleText = gaugeSVG.append('text')
      .attr('class', 'gaugeT')
      .attr('transform', `translate(${gaugeR / 2},${gaugeR - rimFont})`)
      .style('font-size', `${divSquare / 10}`)
      .text(gTitle);
    titleText
      .transition().duration(5000)
      .attrTween('transform', () => (t) =>
        `translate(${gaugeR / 2},${gaugeR * t}) rotate(${360 * t})`);
  }
  stockbars = (DATA: { axis: string, value: number, alpha: number }[], dataIndex: number, ww: number, hh: number,
    durationtime: number, xText = 'Weight', yText = 'Class') => {
    const svg = d3.select('#barchart')
      .attr('width', ww)
      .attr('height', hh).attr('class', 'stockbars').append('g'),
      chart = svg.append('g'),
      scaleAll = 1;
    const margin = {
      top: 50 * scaleAll,
      right: 50 * scaleAll,
      bottom: 150 * scaleAll,
      left: 70 * scaleAll
    }, bandfiddle = 10000
      , customXAxis = (g: d3.Selection<SVGGElement, {}, HTMLElement, any>) => {
        g.call(d3.axisBottom(xx).tickSize(0));
        const g1 = g.select('.domain').attr('class', 'axis');
        const g2 = g.selectAll('text').attr('class', 'axisNames')
          .attr('x', -5 * scaleAll)
          .attr('y', -5 * scaleAll)
          .attr('transform', 'rotate(-70)');
        if (DATA.length > 30) {
          g.selectAll('text').style('fill', 'none').style('stroke', 'none');
        }
        if (scaleAll < 1.0) {
          g1.style('font-size', (+g1.style('font-size').replace('px', '') * scaleAll) + 'px');
          g2.style('font-size', (+g2.style('font-size').replace('px', '') * scaleAll) + 'px');
        }
      }
      , rim = 5 * scaleAll
      , width = ww - margin.left - margin.right
      , height = hh - margin.top - margin.bottom
      , x = d3.scaleBand().rangeRound([0, bandfiddle * width]).paddingInner(0.1)
      , xx = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1)
      , y = d3.scaleLinear<number, number>().range([height, 0])
        .domain([Math.min(0, d3.min(DATA, d => d.value)),
        d3.max(DATA, d => d.value)]);
    svg.attr('transform', `translate(${margin.left}, ${margin.top})`);
    x.domain(DATA.map(d => d.axis)).padding(0.1);
    xx.domain(DATA.map(d => d.axis)).padding(0.1);
    const yAxis = d3.axisLeft(y).ticks(2)
      , svgX = svg.append('g').attr('transform', `translate(0, ${height})`).attr('class', 'axis').call(customXAxis)
      , svgY = svg.append('g').attr('transform', 'translate(0,0)').attr('class', 'axis').call(yAxis)
      , titleY = svg.append('text').attr('class', 'axisLabel').attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left * 0.6).attr('x', 0 - (height / 2)).text(xText)
      , titleX = svg.append('text').attr('transform', 'translate(0, ' + height + ')')
        .attr('class', 'axisLabel').attr('x', width / 2).attr('y', margin.bottom * 0.9)
        .text(yText)
      , rimmy2 = svg.append('rect').attr('class', 'rim').attr('x', 0).attr('y', 0)
        .attr('width', width).attr('height', height)
      , rimmy1 = svg.append('rect').attr('class', 'rim').attr('x', -margin.left)
        .attr('y', -margin.top).attr('width', ww).attr('height', hh);
    // -----------------------------------------------Rim Outline-----------------------------------
    chart.selectAll('.bar').data(DATA).enter().append('rect').attr('class', 'barrim')
      .attr('width', x.bandwidth() / bandfiddle + 2 * rim)
      .attr('x', d => x(d.axis) / bandfiddle - rim)
      .attr('lineindex', d => d.axis)
      .attr('height', d => rim + (d.value <= 0 ? y(d.value) - y(0) : y(0) - y(d.value)))
      .attr('y', d => (d.value <= 0 ? y(0) : y(d.value) - rim))
      .on('mousemove', d => this.tTip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px')
        .style('display', 'inline-block')
        .html(`<i class='fa fa-gears leafy'></i>${d.axis}<br>weight:${d.value}`))
      .on('mouseleave', () => this.tTip.style('display', 'none'));
    // --------------------------------------------------------------------------------------------
    chart.selectAll('.bar').data(DATA).enter().append('rect')
      .attr('width', x.bandwidth() / bandfiddle)
      .attr('x', d => x(d.axis) / bandfiddle)
      .attr('lineindex', d => d.axis)
      .attr('height', d => {
        const deviation = 0;
        return deviation <= 0 ? y(deviation) - y(0) : y(0) - y(deviation);
      })
      .attr('y', d => {
        const deviation = 0;
        return deviation <= 0 ? y(0) : y(deviation);
      })
      .attr('class', d => d.value > 0 ? 'weightSinglePlus' : 'weightSingleMinus')
      .attr('picId', dataIndex)
      //      .style('fill-opacity', 0.35)
      .on('mousemove', d => this.tTip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px').style('display', 'inline-block')
        .html(`<i class='fa fa-gears leafy'></i>${d.axis}<br>weight:${d3.format('0.5f')(d.value)}<br>
        ${d.alpha === undefined ? '' : 'alpha:' + d3.format('0.5f')(d.alpha)}`))
      .on('mouseleave', () => this.tTip.style('display', 'none'))
      .transition().duration(durationtime)
      .attr('height', d => d.value <= 0 ? y(d.value) - y(0) : y(0) - y(d.value))
      .attr('y', d => d.value <= 0 ? y(0) : y(d.value));
    if (scaleAll < 1) {
      chart.style('stroke-width', +chart.style('stroke-width').replace('px', '') * scaleAll);
      titleX.style('font-size', (+titleX.style('font-size').replace('px', '') * scaleAll) + 'px');
      titleY.style('font-size', (+titleY.style('font-size').replace('px', '') * scaleAll) + 'px');
      svgX.style('font-size', (+svgX.style('font-size').replace('px', '') * scaleAll) + 'px');
      svgY.style('font-size', (+svgY.style('font-size').replace('px', '') * scaleAll) + 'px');
    }
  }
}
