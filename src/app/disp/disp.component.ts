import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { isString, isObject } from 'util';
import { rgb } from 'd3';
@Component({
  selector: 'app-disp',
  templateUrl: './disp.component.html',
  styleUrls: ['./disp.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DispComponent implements OnInit {
  updateLabel = 'Update';
  getLabel = 'Refresh';
  filename = '';
  displayData: any = {};
  changeName(v: string) {
    console.log('input field returned', v);
    this.filename = v;
  }
  changeDat() {
    console.log(`${this.updateLabel} Pressed`);
    console.log(this.dataService.url);
    this.dataService.sendData('opt', { filename: this.filename })
      .subscribe(ddd => {
        this.displayData = ddd;
        this.picture();
        this.filename = this.displayData.file;
      });
  }
  getDat() {
    console.log(`${this.getLabel} Pressed`);
    console.log(this.dataService.url);
    this.dataService.getData()
      .subscribe(ddd => {
        this.displayData = ddd;
        this.filename = this.displayData.file;
        this.picture();
      });
  }
  constructor(private dataService: DataService) { }
  ngOnInit() {
    this.getDat();
  }
  picture() {
    const picData: { Name: string, Weight: number, Initial: number, Trade: number }[] = [];
    this.displayData.w.forEach((d, i) => {
      const init = this.displayData.initial === undefined || this.displayData.initial.length === 0 ? 0 : this.displayData.initial[i];
      picData.push({
        Name: this.displayData.names === undefined ? `Stock ${i}` : this.displayData.names[i],
        Weight: this.displayData.w[i],
        Initial: init,
        Trade: (this.displayData.w[i] - init)
      });
    });
    d3.select('app-disp').selectAll('.divradar').remove();
    d3.select('app-disp').selectAll('.outerScrolled').remove();
    d3.select('app-disp').selectAll('.notScrolled').remove();
    const fontSize = 15;
    const hhh = fontSize + 5, www = fontSize * 9;
    const ww = www * Object.keys(picData[0]).length, newDim = 700, rim = newDim / 10;
    let hh = (this.displayData.n + 1) * hhh;
    let mHW = (Math.min(ww, hh), newDim - rim * 2);
    hh = Math.max(hh, mHW);
    const format = (i: any) => isString(i) ? i : d3.format('0.5f')(i);
    const divScrolled = d3.select('app-disp').append('div')
      .attr('class', 'outerScrolled')
      .attr('style', `position:relative;top:${rim}px;left:${rim}px;width:${ww}px;height:${mHW}px`)
      .append('div')
      .attr('class', 'innerScrolled')
      .attr('style', `position:relative;overflow:auto;top:${hhh};width:${ww}px;height:${mHW}px`)
      ;
    d3.select('app-disp')
      .append('div')
      .attr('class', 'notScrolled')
      .attr('style', `position:relative;left:${rim}px;top:${-mHW + rim - hhh}px;width:${ww}px;height:${hhh}px`);
    const svgs = d3.select('.innerScrolled').append('svg');
    svgs.attr('width', ww)
      .attr('height', hh)
      .attr('class', 'picture' + 'app-disp');
    const svg = svgs.append('g');
    const xPos = d3.scaleLinear().domain([0, 4]).range([0, ww]);
    const yPos = d3.scaleLinear().domain([0, picData.length]).range([0, hh]);
    d3.select('.notScrolled').append('svg')
      .append('rect')
      .attr('class', 'trades')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', ww)
      .attr('height', hhh);
    d3.select('.notScrolled').select('svg')
      .attr('width', ww)
      .attr('height', hhh)
      .attr('class', 'picture' + 'app-disp').append('text')
      .attr('class', 'trades')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', `${fontSize}px`)
      .attr('transform', `translate(${www / 4},${hhh * 0.75})`)
      .call(dd => {
        const keys = Object.keys(picData[0]);
        const here = dd;
        for (let kk = 0; kk < keys.length; ++kk) {
          const t = (kk + 1) / keys.length;
          here.append('tspan')
            .style('stroke', () => `rgb(${200 * (1 - t)},${t / 2 * 255},${200 * t})`)
            .attr('x', xPos(kk))
            .attr('y', yPos(0))
            .text(format(keys[kk]));
        }
      });
    svg.append('rect')
      .attr('class', 'trades')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', ww)
      .attr('height', hh);
    svg.selectAll('trades').data(picData).enter()
      .append('text')
      .attr('class', 'trades')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', `${fontSize}px`)
      .attr('transform', `translate(${www / 4},${hhh * 0.75})`)
      .call(d => d.each((dd, i, j) => {
        const keys = Object.keys(dd);
        const here = d3.select(j[i]);
        for (let kk = 0; kk < keys.length; ++kk) {
          const t = (kk + 1) / keys.length;
          here.append('tspan')
            .style('stroke', () => `rgb(${200 * (1 - t)},${t / 2 * 255},${200 * t})`)
            .attr('x', xPos(kk))
            .attr('y', yPos(i))
            .text(format(dd[keys[kk]]));
        }
      }));
    const radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(200,50,50)', 'rgb(50,200,50)',
      'rgb(244,244,50)', 'rgb(50,244,244)']);
    const divRadar = d3.select('app-disp').append('div')
      .attr('style', `position:relative;left:${ww + rim}px;top:${-mHW}px;width:${newDim}px;height:${newDim}px`)
      .attr('class', 'divradar');
    mHW = newDim;
    const margin = mHW / 5;
    const config = {
      w: mHW - 2 * margin, h: mHW - 2 * margin, margin: { top: margin, right: margin, bottom: margin, left: margin }, maxValue: 0,
      levels: 3, roundStrokes: true, colour: radarBlobColour
    };
    const radarData = [picData.map((d) => ({
      axis: Math.abs(d.Trade) > 1e-3
        && d.Name !== undefined ? d.Name : '', value: d.Trade
    }))];
    const nameInvert = {};
    picData.forEach((d, i) => {
      nameInvert[d.Name] = i;
    });
    this.RadarChart('.divradar', radarData, config);

    d3.select('app-disp').select('.innerScrolled').selectAll('text')
      .on('mouseover', (d, i, j) => {
        const here = ((j[i]) as SVGElement).parentElement.parentElement.parentElement;
        here.scrollTo(0, i * hhh);
        d3.select(j[i]).classed('touch', true);
      })
      .on('mouseout', (d, i, j) => d3.select(j[i]).classed('touch', false));


    d3.select('app-disp').select('.notScrolled').selectAll('text')
      .on('mouseover', (d, i, j) => d3.select(j[i]).classed('touch', true))
      .on('mouseout', (d, i, j) => d3.select(j[i]).classed('touch', false));

    d3.select('app-disp').selectAll('.divradar').selectAll('text')
      .on('mouseover', (d: string, i, j) => {
        d3.select(d3.select('app-disp').select('.innerScrolled')
          .selectAll('text').nodes()[nameInvert[d]]).classed('touch', true);
        const next = d3.select(d3.select('app-disp').select('.innerScrolled')
          .selectAll('text').nodes()[nameInvert[d]]).node();
        (next as SVGAElement).parentElement.parentElement.
          parentElement.scrollTo(0, hhh * nameInvert[d]);
        d3.select(j[i]).classed('touch', true);
      })
      .on('mouseout', (d: string, i, j) => {
        d3.select(d3.select('app-disp').select('.innerScrolled')
          .selectAll('text').nodes()[nameInvert[d]]).classed('touch', false);
        d3.select(j[i]).classed('touch', false);
      });
  }
  RadarChart(id: string, data: { axis: string; value: number; }[][], options: {
    w: number; h: number;
    margin: { top: number; right: number; bottom: number; left: number; };
    maxValue: number; levels: number; roundStrokes: boolean; colour: d3.ScaleOrdinal<number, string>;
  }) {
    const cfg = {
      w: 600,				// Width of the circle
      h: 600,				// Height of the circle
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
      levels: 3,				// How many levels or inner circles should there be drawn
      maxValue: 0, 			// The value that the biggest circle will represent
      labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
      lineHeight: 1.4, 		// Height for wrapped lines
      dotRadius: 4, 			// The size of the coloured circles of each blog
      opacityCircles: 0.1, 	// The opacity of the circles of each blob
      strokeWidth: 2, 		// The width of the stroke around each blob
      roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
      colour: d3.scaleOrdinal<number, string>(d3.schemeCategory10).domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    };
    if ('undefined' !== typeof options) {
      for (const i in options) {
        if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
      }
    }
    const maxValue = Math.max(cfg.maxValue, +d3.max(data, (i) => d3.max(i.map((o) => o.value))));
    const minValue = Math.min(cfg.maxValue, +d3.min(data, (i) => d3.min(i.map((o) => o.value))));
    const allAxis = (data[0].map((i) => i.axis)),	// Names of each axis
      total = allAxis.length,					// The number of different axes
      radius = Math.min(cfg.w, cfg.h) / 2, 	// Radius of the outermost circle
      tradeFormat = d3.format('0.1e');
    let pMin = Math.min(-maxValue, minValue);
    const pMax = Math.max(-minValue, maxValue);
    if (minValue >= -1e-15) {
      pMin = 0;
    }
    const rScale = d3.scaleLinear<number, number>()
      .range([0, radius])
      .domain([pMin, pMax]);
    const svg = d3.select(id).append('svg'), doView = false;
    if (doView) {
      svg.attr('viewBox', `0 0 ${cfg.w + cfg.margin.left + cfg.margin.right} ${cfg.h + cfg.margin.top + cfg.margin.bottom}`)
        .attr('class', 'radar' + id);
    } else {
      svg
        .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
        .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr('class', 'radar' + id);
    }
    const baseSvg = svg.append('g')
      .attr('transform', 'translate(' + (cfg.w / 2 + cfg.margin.left) + ',' + (cfg.h / 2 + cfg.margin.top) + ')'),
      filter = baseSvg.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'colouredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'colouredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic'),
      axisGrid = baseSvg.append('g').attr('class', 'axisWrapper');

    const circScale = d3.scaleLinear<number, number>().domain([pMin < 0 ? -cfg.levels : 0, cfg.levels]).range([0, radius]);
    const circVal = d3.scaleLinear<number, number>().domain([pMin < 0 ? -cfg.levels : 0, cfg.levels])
      .range([pMin, pMax]);
    const angleScale = d3.scaleLinear<number, number>().domain([0, data[0].length]).range([0, Math.PI * 2]);
    axisGrid.selectAll('.levels')
      .data(d3.range(pMin < 0 ? -cfg.levels : 0, (cfg.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', d => circScale(d))
      .style('fill-opacity', cfg.opacityCircles)
      .style('stroke-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)');
    if (pMin < 0) {
      axisGrid.append('path')
        .attr('class', 'gridZero')
        .attr('d', () => d3.arc()({
          innerRadius: circScale(0),
          outerRadius: circScale(0),
          startAngle: 0,
          endAngle: 0
        }))
        .transition().duration(2000)
        .attrTween('d', () => (t) => d3.arc()({
          innerRadius: circScale(0),
          outerRadius: circScale(0),
          startAngle: -(t + 0.5) * Math.PI,
          endAngle: (t - 0.5) * Math.PI
        }));
    }
    const radarLine = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => angleScale(i));
    const radarLineZ = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(0))
      .angle((d, i) => angleScale(-i)); // Minus is important to get the shading correct!
    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCatmullRomClosed);
      radarLineZ.curve(d3.curveCatmullRomClosed);
    }
    const blobChooser = (k: number) =>
      // tslint:disable-next-line:max-line-length
      `M${cfg.margin.right / 2 + radius} ${-cfg.margin.right / 2 - radius + k * radius / 10}l${radius / 10} 0l0 ${radius / 10}l-${radius / 10} 0z`;
    const blobWrapper = baseSvg.selectAll('.radarWrapper')
      .data(data)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarWrapper');
    blobWrapper
      .append('path')
      .attr('class', 'portfolioFlower')
      .attr('d', (d, i) => (pMin < 0 ? radarLine(d) + radarLineZ(d) : radarLine(d)) + blobChooser(i))
      .style('fill', (d, i) => cfg.colour(i))
      .on('mouseover', (d, i, jj) => {
        // Dim all blobs
        d3.selectAll('.portfolioFlower')
          .transition().duration(2)
          .attr('class', 'portfolioFlower dim');
        // Bring back the hovered over blob
        d3.select(jj[i])
          .transition().duration(2)
          .attr('class', 'portfolioFlower over');
        d3.selectAll(`rect.weightSinglePlus`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.classed('over', true);
          }
        });
        d3.selectAll(`rect.weightSingleMinus`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.classed('over', true);
          }
        });
        d3.selectAll(`.users`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.classed('over', true);
          }
        });
        d3.selectAll(`.rmessage`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.classed('over', true);
          }
        });
        d3.selectAll(`.totals`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.classed('over', true);
          }
        });
      })
      .on('mouseout', () => {
        d3.selectAll(`.users`).nodes().forEach(hh => {
          d3.select(hh).classed('over', false);
        });
        d3.selectAll(`.rmessage`).nodes().forEach(hh => {
          d3.select(hh).classed('over', false);
        });
        d3.selectAll('.portfolioFlower')
          .transition().duration(10)
          .attr('class', 'portfolioFlower');
        d3.selectAll('rect.weightSinglePlus')
          .classed('over', false);
        d3.selectAll('rect.weightSingleMinus')
          .classed('over', false);
        d3.selectAll('.totals').classed('over', false);
      }
      );
    blobWrapper.append('path')
      .attr('class', 'radarStroke')
      .style('stroke-width', cfg.strokeWidth + 'px')
      .style('stroke', 'white')
      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .attr('d', d => radarLine(d))
      .style('stroke', (d, i) => cfg.colour(i))
      .style('fill', 'none')
      .style('filter', 'url(#glow)');
    blobWrapper.selectAll('.radarCircle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'radarCircle')
      .attr('r', cfg.dotRadius)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+((j[i].parentNode) as SVGGElement).getAttribute('data-index')))
      .style('fill-opacity', 0.8);
    const blobCircleWrapper = baseSvg.selectAll('.radarCircleWrapper')
      .data(data)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarCircleWrapper');
    blobCircleWrapper.selectAll('.radarInvisibleCircle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.1)
      .attr('lineindex', d => d.axis)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+((j[i].parentNode) as SVGGElement).getAttribute('data-index')))
      .style('fill-opacity', 0)
      .style('pointer-events', 'all')
      .on('mouseover', (d, i, j) => {
        const ppp: d3.CustomEventParameters | MouseEvent = d3.event;
        const dataId = ((j[i]).parentNode as SVGGElement).getAttribute('data-index');
        console.log(isObject(ppp.detail), ppp);
        if (!isObject(ppp.detail)) {
          d3.select('app-users').selectAll('rect.totals').each((tt, ii,
            jj: SVGRectElement[] | d3.ArrayLike<SVGRectElement>) => {
            const hereTot = jj[ii]; // Show how to use DOM since we know we've got a rect element.
            const facId: string =
              this.displayData[0].factors.map(
                (dk: { axis: string; value: number; }) => dk.axis)[ii % this.displayData[0].factors.length];
            if (facId === d.axis && hereTot.getAttribute('picId') === dataId) {
              hereTot.setAttribute('class', hereTot.getAttribute('class') + ' select');
              // Testing passing arguments to dispatch
              const passArgs: d3.CustomEventParameters = {
                bubbles: true,    // If true, the event is dispatched to ancestors in reverse tree order
                cancelable: true, // If true, event.preventDefault is allowed
                detail: {
                  factorName: facId,
                  dataIndex: hereTot.getAttribute('picId')
                }
              };
              d3.select(hereTot).dispatch('myselect', passArgs);
            }
          });
          ['rect.weightSinglePlus', 'rect.weightSingleMinus', 'text.users'].forEach(ss => {
            d3.select('app-users').selectAll(ss).classed('over', (tt, ii,
              jj: SVGTextElement[] | SVGRectElement[] | d3.ArrayLike<SVGTextElement> | d3.ArrayLike<SVGRectElement>) =>
              (jj[ii].getAttribute('lineindex') === d.axis && jj[ii].getAttribute('picId') === dataId) ? true : false
            );
          });
        }
        localTiptool
          .attr('x', parseFloat((j[i]).getAttribute('cx')) - 10)
          .attr('y', parseFloat((j[i]).getAttribute('cy')) - 10)
          .style('fill', 'none')
          .style('opacity', 1)
          .text(tradeFormat(+d.value))
          .transition().duration(200)
          .style('fill', (j[i]).style['fill']);
      })
      .on('mouseout', () => {
        d3.select('app-users').selectAll('rect.totals').classed('select', false);
        ['rect.weightSinglePlus', 'rect.weightSingleMinus', 'text.users'].forEach(ss => {
          d3.select('app-users').selectAll(ss).classed('over', false);
        });
        localTiptool.transition().duration(200).style('fill', 'none');
      }
      );

    const axis = axisGrid.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 10)
      .attr('y2', -10)
      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .tween('lines', (d, i, j) => t => {
        const extension = 1.13;
        j[i].setAttribute('x2', '' + rScale(pMax * extension) * Math.cos(angleScale(i) - Math.PI / 2) * t);
        j[i].setAttribute('y2', '' + rScale(pMax * extension) * Math.sin(angleScale(i) - Math.PI / 2) * t);
      })
      .attr('class', 'line');
    axis.append('text')
      .attr('class', (d, i) => {
        const x = rScale(pMax * cfg.labelFactor) * Math.cos(angleScale(i) - Math.PI / 2);
        return Math.abs(x) <= 1e-6 ? 'legendRadar' : x > 0 ? 'legendRadar right' : 'legendRadar left';
      })
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(pMax * cfg.labelFactor) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y', (d, i) => rScale(pMax * cfg.labelFactor) * Math.sin(angleScale(i) - Math.PI / 2))
      .text(d => d)
      .call(this.wrapFunction, cfg.wrapWidth, cfg.lineHeight);
    axisGrid.selectAll('.axisLabel')
      .data(d3.range(pMin < 0 ? -cfg.levels : 0, (cfg.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axisRadar')
      .attr('x', -12)
      .attr('y', d => -circScale(d))
      .attr('dy', '0.4em')
      .text((d, i) => tradeFormat(circVal(d)));
    const localTiptool = baseSvg.append('text')
      .attr('class', 'tooltipRadar')
      .style('opacity', 0);
  }
  wrapFunction = (text1: any, width: number, lineHeight: number) =>  // Adapted from http://bl.ocks.org/mbostock/7555321
    text1.each((_kk, i, j) => {
      const text = d3.select(j[i]),
        words = text.text().split(/\s+/).reverse(),
        y = text.attr('y'),
        x = text.attr('x'),
        dy = parseFloat(text.attr('dy'));
      let word, line = [],
        lineNumber = 0,
        tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if ((tspan.node() as SVGTSpanElement).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    })
}
