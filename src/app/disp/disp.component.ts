import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';
import { isString } from 'util';
@Component({
  selector: 'app-disp',
  templateUrl: './disp.component.html',
  styleUrls: ['./disp.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DispComponent implements OnInit {
  tTip = d3.select('app-disp').append('g').attr('class', 'tooltip');
  updateLabel = 'Update';
  getLabel = 'Refresh';
  sendGamma = '';
  filename = '';
  gammaFormat = d3.format('0.5f');
  displayData: any = {};
  plotThresh = 1e-3;
  extraScroll = -1;
  sendBack = {};
  changeName(v: string) {
    console.log('input field returned', v);
    this.filename = v;
  }
  newGamma(v: string) {
    delete this.sendBack['gamma'];
    this.sendBack['gamma'] = v;
    this.sendGamma = v;
  }
  sendDataToServer() {
    Object.keys(this.sendBack).forEach(d => {
      if (this.sendBack[d] === '') {
        this.sendBack[d] = undefined;
      }
    });
    this.dataService.sendData('opt', { filename: this.filename, desired: this.sendBack })
      .subscribe(ddd => {
        this.displayData = ddd;
        this.filename = this.displayData.file;
        this.picture();
      });
  }
  reset() {
    this.sendBack = {};
    this.sendGamma = '';
  }
  displayServerData() {
    this.dataService.getData()
      .subscribe(ddd => {
        console.log('In subscribe');
        if (ddd.file !== undefined) {
          this.displayData = ddd;
          this.filename = this.displayData.file;
          this.picture();
        }
      });
    console.log('After subscribe');
  }
  constructor(private dataService: DataService) { }
  ngOnInit() {
    d3.select('app-disp').attr('title', 'Optimisation Results');
    this.displayServerData();
  }
  picture() {
    d3.select('app-disp').selectAll('.divradar').remove();
    d3.select('app-disp').selectAll('.divradar2').remove();
    d3.select('app-disp').selectAll('.outerScrolled').remove();
    d3.select('app-disp').selectAll('.notScrolled').remove();
    d3.select('app-disp').selectAll('.oDivRisk').remove();
    d3.select('app-disp').selectAll('.nsDivRisk').remove();
    d3.select('#SB').selectAll('div').remove();
    const picData: { Name: string, Weight: number | string, Initial: number | string, Trade: number }[] = [];
    this.displayData.w.forEach((d: number, i: number) => {
      const init = this.displayData.initial === undefined || this.displayData.initial.length === 0 ? 0 : this.displayData.initial[i];
      picData.push({
        Name: this.displayData.names === undefined ? `Stock ${i}` : this.displayData.names[i],
        Weight: d,
        Initial: init,
        Trade: (d - init)
      });
    });
    this.sendGamma = this.displayData.gamma === undefined ? '' : this.displayData.gamma;
    const fontSize = 15;
    const hhh = fontSize + 3, www = fontSize * 10, newDim = 600, margin = newDim / 5;
    const ww = www * Object.keys(picData[0]).length;
    let hh = (this.displayData.n + 2) * hhh;
    let mHW = Math.max(Math.min(ww, hh), newDim);
    hh = Math.max(hh, mHW);
    picData.push({
      Name: '', Weight: '', Initial: '', Trade: this.displayData.turnover
    });
    d3.select('app-disp').append('div')
      .attr('style', `left:${0}px;top:${0}px;width:${newDim}px;height:${newDim}px`)
      .attr('class', 'divradar');
    d3.select('app-disp').append('div')
      .attr('class', 'notScrolled')
      .attr('style', `left:${newDim + 5}px;top:${-3 * newDim / 4}px;width:${ww}px;height:${hhh}px`);
    d3.select('app-disp').append('div')
      .attr('class', 'outerScrolled')
      .attr('style', `left:${newDim + 5}px;top:${-3 * newDim / 4}px`)
      .append('div')
      .attr('class', 'innerScrolled')
      .attr('style', `width:${ww}px;height:${newDim / 2}px`)
      ;
    this.tableDisplay(ww, hh, picData, fontSize, '.innerScrolled', '.notScrolled');
    mHW = newDim;
    const nameInvert = {};
    picData.forEach((d, i) => {
      nameInvert[d.Name] = i;
    });
    // -------------------------------------Data for Radar Plot Start
    const radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(200,50,50)', 'rgb(50,200,50)',
      'rgb(150,150,50)', 'rgb(50,244,244)']); const config = {
        w: mHW - 2 * margin, h: mHW - 2 * margin, margin: { top: margin, right: margin, bottom: margin, left: margin }, maxValue: 0,
        levels: 3, roundStrokes: true, colour: radarBlobColour
      };
    picData.pop();
    const radarData = [picData.map((d) => ({
      axis: Math.abs(d.Trade) > this.plotThresh
        && d.Name !== undefined ? d.Name : '', value: +d.Weight
    })), picData.map((d) => ({
      axis: Math.abs(d.Trade) > this.plotThresh
        && d.Name !== undefined ? d.Name : '', value: +d.Initial
    })), picData.map((d) => ({
      axis: Math.abs(d.Trade) > this.plotThresh
        && d.Name !== undefined ? d.Name : '', value: d.Trade
    }))];
    const plotKeys = Object.keys(picData[0]);
    plotKeys.shift();
    // -------------------------------------Data for Radar Plot End
    this.RadarChart('.divradar', radarData, config, plotKeys);
    const picData2: {
      Name: string, Weight: number | string,
      Benchmark: number | string, Beta: number, MCTR: number, MCAR: number, Active: number | string
    }[] = [];
    this.displayData.w.forEach((d: number, i: number) => {
      const bench = this.displayData.benchmark === undefined || this.displayData.benchmark.length === 0 ? 0 : this.displayData.benchmark[i];
      picData2.push({
        Name: this.displayData.names === undefined ? `Stock ${i}` : this.displayData.names[i],
        Weight: d,
        Benchmark: bench,
        Beta: this.displayData.beta[i],
        MCTR: this.displayData.MCTR[i],
        MCAR: this.displayData.MCAR[i],
        Active: d - bench
      });
    });
    const wwR = www * Object.keys(picData2[0]).length;
    hh = (this.displayData.n + 2) * hhh;
    mHW = Math.max(Math.min(wwR, hh), newDim);
    hh = Math.max(hh, mHW);
    picData2.push({
      Name: '', Weight: '', Benchmark: '', Beta: this.displayData.pbeta,
      MCTR: this.displayData.arisk, MCAR: this.displayData.risk, Active: ''
    });
    const spacer = 0.625 * newDim;
    d3.select('app-disp').append('div')
      .attr('style', `left:${0}px;top:${-spacer}px;width:${newDim}px;height:${newDim}px`)
      .attr('class', 'divradar2');
    d3.select('app-disp')
      .append('div')
      .attr('class', 'nsDivRisk')
      .attr('style', `left:${newDim + 5}px;top:${-spacer - 3 * newDim / 4}px;width:${wwR}px;height:${hhh}px`);
    d3.select('app-disp').append('div')
      .attr('class', 'oDivRisk')
      .attr('style', `left:${newDim + 5}px;top:${-spacer - 3 * newDim / 4}px`)
      .append('div')
      .attr('class', 'iDivRisk')
      .attr('style', `width:${wwR}px;height:${newDim / 2}px`)
      ;
    this.tableDisplay(wwR, hh, picData2, fontSize, '.iDivRisk', '.nsDivRisk');
    mHW = newDim;

    // -------------------------------------Data for Radar Plot Start
    picData2.pop();
    const radarData2 = [picData2.map((d) => ({
      axis: Math.abs(+d.Active) > this.plotThresh
        && d.Name !== undefined ? d.Name : '', value: +d.Weight
    })), picData2.map((d) => ({
      axis: Math.abs(+d.Active) > this.plotThresh
        && d.Name !== undefined ? d.Name : '', value: +d.Benchmark
    })), picData2.map((d) => ({
      axis: Math.abs(+d.Active) > this.plotThresh
        && d.Name !== undefined ? d.Name : '', value: +d.Active
    }))];

    const plotKeys2 = ['Weight', 'Benchmark', 'Active'];
    // -------------------------------------Data for Radar Plot End
    this.RadarChart('.divradar2', radarData2, config, plotKeys2);
    d3.select('app-disp').select('.innerScrolled').selectAll('text')
      .on('mouseover', (d: Event) => d3.select((d.target as SVGTextElement).parentElement).classed('touch', true))
      .on('mouseout', (d: Event) => d3.select((d.target as SVGTextElement).parentElement).classed('touch', false));

    d3.select('app-disp').select('.iDivRisk').selectAll('text')
      .on('mouseover', d => d3.select((d.target as SVGTextElement).parentElement).classed('touch', true))
      .on('mouseout', d => d3.select((d.target as SVGTextElement).parentElement).classed('touch', false));


    d3.select('app-disp').select('.notScrolled').selectAll('text')
      .on('mouseover', d => d3.select(d.target).classed('touch', true))
      .on('mouseout', d => d3.select(d.target).classed('touch', false));
    d3.select('app-disp').select('.nsDivRisk').selectAll('text')
      .on('mouseover', d => d3.select(d.target).classed('touch', true))
      .on('mouseout', d => d3.select(d.target).classed('touch', false));
    ['.divradar', '.divradar2'].forEach(cls => {
      d3.select('app-disp').selectAll(cls).selectAll('text')
        .on('mouseover', (e: Event, d: string) => {
          const divScrolled = d3.select('app-disp').select('.innerScrolled');
          d3.select(divScrolled.selectAll('text').nodes()[nameInvert[d]]).classed('touch', true); // Highlight in the table
          /*        const next = d3.select(d3.select('app-disp').select('.innerScrolled')
                    .selectAll('text').nodes()[nameInvert[d]]).node();
                  (next as SVGAElement).parentElement.parentElement.
                    parentElement.scrollTo(0, hhh * nameInvert[d]); First attempt that worked*/
          //        (divScrolled.node()).scrollTo(0, hhh * nameInvert[d]); // Scroll table so we see the highlighted part
          (divScrolled.node() as HTMLDivElement).scrollTop = hhh * (nameInvert[d] + this.extraScroll);
          const riskScrolled = d3.select('app-disp').select('.iDivRisk');
          d3.select(riskScrolled.selectAll('text').nodes()[nameInvert[d]]).classed('touch', true); // Highlight in the table
          /*        const next = d3.select(d3.select('app-disp').select('.innerScrolled')
                    .selectAll('text').nodes()[nameInvert[d]]).node();
                  (next as SVGAElement).parentElement.parentElement.
                    parentElement.scrollTo(0, hhh * nameInvert[d]); First attempt that worked*/
          d3.select((e.target as SVGTextElement).parentElement).classed('touch', true);
          //        (riskScrolled.node()).scrollTo(0, hhh * nameInvert[d]); // Scroll table so we see the highlighted part
          (riskScrolled.node() as HTMLDivElement).scrollTop = hhh * (nameInvert[d] + this.extraScroll);
        })
        .on('mouseout', (e: Event, d: string) => {
          const divScrolled = d3.select('app-disp').select('.innerScrolled');
          d3.select(divScrolled.selectAll('text').nodes()[nameInvert[d]]).classed('touch', false);
          const riskScrolled = d3.select('app-disp').select('.iDivRisk');
          d3.select(riskScrolled.selectAll('text').nodes()[nameInvert[d]]).classed('touch', false);
          d3.select((e.target as SVGTextElement).parentElement).classed('touch', false);
        });
    });



    const ll = 0, wh = 200, h_h = 30;
    d3.select('#SB').attr('style', `overflow-x:auto;overflow-y:hidden;width:960px;scroll-behaviour:smooth`);
    d3.select('#SB').append('div')
      .attr('class', 'nsSB')
      .attr('style', `width:${wh}px;height:${h_h}px`);
    d3.select('#SB').append('div')
      .attr('class', 'oSB')
      .append('div')
      .attr('class', 'iSB')
      .attr('style', `width:${wh}px;height:${h_h}px`)
      ;
    if (Object.keys(this.sendBack).length !== 0) {
      this.tableDisplay(wh * Object.keys(this.sendBack).length, h_h, [this.sendBack], 20, '.iSB', '.nsSB');
      d3.select('#SB').selectAll('svg').selectAll('rect').attr('style', 'fill-opacity:0.1;fill:lightgreen');

    }
    // New Gauge chart=========================================
    const showGauge = true;
    if (!showGauge) {
      d3.select('#scl').remove();
    } else {
      const rimData = [1, 4, 7, 1];
      const innerNumbers = [34, 56, 67];
      const rimColours = ['red', 'blue', 'green', 'brown'];
      const gTitle = 'RISK';
      const rimDef = 30, rimFont = 30;
      let sumRim = 0, sofar = 0;
      rimData.forEach(d => {
        sumRim += d;
      });
      const arcScale = d3.scaleLinear()
        .domain([0, sumRim])
        .range([(180 + rimDef) / 360 * Math.PI * 2, (180 + 360 - rimDef) / 360 * Math.PI * 2]);
      const gaugeR = 300;
      d3.select('#scl').attr('style', 'overflow:auto;height:350px;width:350px'); // Only scrolls if gaugeR is bigger than 350
      const gaugeSVG = d3.select('#scl').select('#gauge');
      gaugeSVG.attr('width', gaugeR).attr('height', gaugeR);
      gaugeSVG.selectAll('path').remove();
      gaugeSVG.selectAll('text').remove();
      gaugeSVG.selectAll('.rims').data(rimData).enter()
        .append('path')
        .attr('class', 'gauge')
        .attr('transform', `translate(${gaugeR / 2},${gaugeR / 2})`)
        .style('fill', (d, i) => rimColours[i])
        .on('mousemove', (e: MouseEvent, d) => {
          this.tTip.attr('style', `left:${e.pageX + 20}px;top:${e.pageY + 20}px;display:inline-block`)
            .html(`<i class='fa fa-weibo leafy'></i> ${d}`);
        })
        .on('mouseout', () => {
          this.tTip.attr('style', `display:none`)
            .html('');
        })
        .transition().duration(5000)
        .attrTween('d', d => {
          const s = sofar;
          sofar += d;
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
      const tit = gaugeSVG.append('text')
        .attr('class', 'gaugeT')
        .attr('transform', `translate(${gaugeR / 2},${gaugeR - rimFont})`)
        .text(gTitle);
      tit
        .transition().duration(5000)
        .attrTween('transform', () => (t) =>
          `translate(${gaugeR / 2},${gaugeR * t - +tit.style('font-size').replace('px', '') / 4}) rotate(${360 * t})`);
    }
    // ==============================================================    // Allways scroll to the end of the divs.
    let pHH = (d3.select('app-disp').select('.innerScrolled').node() as HTMLDivElement);
    pHH.scrollTop = pHH.scrollHeight;
    pHH = (d3.select('app-disp').select('.iDivRisk').node() as HTMLDivElement);
    pHH.scrollTop = pHH.scrollHeight;
    pHH = (d3.select('#SB').node() as HTMLParagraphElement);
    pHH.scrollLeft = pHH.scrollWidth;
    const tSelect = d3.selectAll('.trades').selectAll('tspan')
      .on('click', (e: Event) => {
        const topper = (e.target as SVGTSpanElement).parentNode.parentNode.parentNode.parentNode.parentNode;
        const kL = (d3.select(topper.previousSibling as HTMLDivElement).selectAll('tspan').nodes()).length;
        const lab = d3.select(e.target as SVGTSpanElement).attr('keynumber');
        const keyDef = (d3.select(topper.previousSibling as HTMLDivElement).selectAll('tspan').nodes()[lab] as SVGTSpanElement);
        (topper.parentNode as HTMLElement).scrollLeft = 0;
        const labH = d3.select(topper)
          .insert('svg')
          .attr('width', 75)
          .attr('height', 25)
          .attr('style', keyDef.getAttribute('style'))
          .append('text').attr('transform', 'translate(0,22)')
          .text(keyDef.textContent);
        d3.select(topper).insert('input')
          .attr('type', 'text')
          .attr('size', '10')
          .style('background-color', d3.select(topper).select('rect').style('fill'))
          .style('text-align', 'right')
          .attr('value', (e.target as SVGTSpanElement).textContent)
          .on('change', (ee: Event) => {
            (e.target as SVGTSpanElement).textContent = (ee.target as HTMLInputElement).value;
            delete this.sendBack[keyDef.textContent];
            this.sendBack[keyDef.textContent] = (ee.target as HTMLInputElement).value;
            if (keyDef.textContent === 'Beta') {
              delete this.sendBack[keyDef.textContent + 'vec'];
              this.sendBack[keyDef.textContent + 'vec'] = this.displayData.beta;
            }
            d3.select(ee.target as HTMLInputElement).remove();
            labH.remove();
          });
      });
  }
  RadarChart(id: string, data: { axis: string; value: number; }[][], options: {
    w: number; h: number;
    margin: { top: number; right: number; bottom: number; left: number; };
    maxValue: number; levels: number; roundStrokes: boolean; colour: d3.ScaleOrdinal<number, string>;
  },
    axisKeys: string[]) {
    const cfg = {
      w: 600,				// Width of the circle
      h: 600,				// Height of the circle
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
      levels: 3,				// How many levels or inner circles should there be drawn
      maxValue: 0, 			// The value that the biggest circle will represent
      labelFactor: 1.5, 	// How much farther than the radius of the outer circle should the labels be placed
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
      tradeFormat = d3.format('0.5f');
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
      `M${cfg.margin.right / 2 + radius} ${-cfg.margin.bottom / 2 - radius + k * radius / 10}l${radius / 10} 0l0 ${radius / 10}l-${radius / 10} 0z`;
    const blobChooserText = baseSvg.selectAll('.datakeys').data(axisKeys).enter()
      .append('text')
      .attr('class', 'datakeys')
      .style('fill', (d, i) => cfg.colour(i))
      .attr('transform', (d, k) => `translate(${radius},${-cfg.margin.bottom / 2 - radius * 0.925 + k * radius / 10})`)
      .text(d => d);

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
      .on('mouseover', (e: Event) => {
        // Dim all blobs
        d3.selectAll('.portfolioFlower')
          .transition().duration(2)
          .attr('class', 'portfolioFlower dim');
        // Bring back the hovered over blob
        d3.select(e.target as SVGPathElement)
          .transition().duration(2)
          .attr('class', 'portfolioFlower over');
      })
      .on('mouseout', () => {
        d3.selectAll('.portfolioFlower')
          .transition().duration(10)
          .attr('class', 'portfolioFlower');
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
    const blobCircles = blobCircleWrapper.selectAll('.radarInvisibleCircle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.1)
      .attr('lineindex', d => d.axis)
      .attr('circle-index', (d, i) => i)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+((j[i].parentNode) as SVGGElement).getAttribute('data-index')))
      .style('fill-opacity', 0)
      .style('pointer-events', 'all')
      .on('mouseover', (e: Event, d) => {
        const i = +d3.select(e.target as SVGCircleElement).attr('circle-index');
        const divScrolled = d3.select('app-disp').select('.innerScrolled');
        console.log(i, divScrolled.selectAll('text').nodes().length);
        d3.select(divScrolled.selectAll('text').nodes()[i]).classed('touch', true);
        d3.select(axis.selectAll('text').nodes()[i])
          .classed('touch', true);
        (divScrolled.node() as HTMLDivElement)
          //  .scrollTo(0, (divScrolled.node() as HTMLDivElement).scrollHeight / data[0].length * i);
          .scrollTop = (divScrolled.node() as HTMLDivElement).scrollHeight / data[0].length * (i + this.extraScroll);
        const riskScrolled = d3.select('app-disp').select('.iDivRisk');
        d3.select(riskScrolled.selectAll('text').nodes()[i])
          .classed('touch', true);
        d3.select(axis.selectAll('text').nodes()[i])
          .classed('touch', true);
        (riskScrolled.node() as HTMLDivElement)
          //  .scrollTo(0, (riskScrolled.node() as HTMLDivElement).scrollHeight / data[0].length * i);
          .scrollTop = (riskScrolled.node() as HTMLDivElement).scrollHeight / data[0].length * (i + this.extraScroll);
        localTiptool
          .attr('x', +((e.target as SVGCircleElement).getAttribute('cx')) - 10)
          .attr('y', +((e.target as SVGCircleElement).getAttribute('cy')) - 10)
          .style('fill', 'none')
          .style('opacity', 1)
          .text(tradeFormat(+d.value))
          .transition().duration(200)
          .style('fill', (e.target as SVGCircleElement).style['fill']);
      })
      .on('mouseout', (e: Event) => {
        const i = +d3.select(e.target as SVGCircleElement).attr('circle-index');
        const divScrolled = d3.select('app-disp').select('.innerScrolled');
        d3.select(divScrolled.selectAll('text').nodes()[i]).classed('touch', false);
        d3.select(axis.selectAll('text').nodes()[i]).classed('touch', false);
        localTiptool.transition().duration(200).style('fill', 'none');
        const riskScrolled = d3.select('app-disp').select('.iDivRisk');
        d3.select(riskScrolled.selectAll('text').nodes()[i]).classed('touch', false);
        d3.select(axis.selectAll('text').nodes()[i]).classed('touch', false);
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
        words = text.text().split(/\s+\./).reverse(),
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
  tableDisplay = (ww: number, hh: number, picData: {}[], fontSize = 12, innerScrolled = '.innerScrolled',
    notScrolled = '.notScrolled') => {
    let optKeys = 0;
    const tableFormat = (i: number | string) =>
      typeof i === 'string' ? i as string : d3.format('0.5f')(i as number), picKeys = Object.keys(picData[0]);
    const svgs = d3.select(innerScrolled).append('svg');
    svgs.attr('width', ww)
      .attr('height', hh)
      .attr('class', 'picture' + 'app-disp');
    const svg = svgs.append('g');
    const xPos = d3.scaleLinear().domain([0, picKeys.length]).range([0, ww - fontSize * 2]);
    const yPos = d3.scaleLinear().domain([0, picData.length]).range([0, hh]);
    if (notScrolled !== '') {
      d3.select(notScrolled).append('svg')
        .attr('class', 'picture' + 'app-disp')
        .append('rect')
        .attr('class', 'trades')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', ww)
        .attr('height', yPos(1));
      d3.select(notScrolled).select('svg')
        .attr('width', ww)
        .attr('height', yPos(1))
        .append('text')
        .attr('class', 'trades')
        .style('font-size', `${fontSize}px`)
        .attr('transform', `translate(${xPos(1)},${yPos(0.75)})`)
        .call(dd => {
          const here = dd;
          optKeys += picKeys.length;
          for (let kk = 0; kk < picKeys.length; ++kk) {
            const t = (kk + 1) / picKeys.length;
            here.append('tspan')
              .attr('x', xPos(kk))
              .attr('y', yPos(0))
              .attr('keynumber', kk)
              .attr('class', 'spacer')
              .style('fill', `${d3.rgb(200 * (1 - t), t / 2 * 255, 200 * t)}`)
              .text(tableFormat(picKeys[kk]));
          }
        });
    }
    svg.append('rect')
      .attr('class', 'trades')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', ww)
      .attr('height', hh);
    svg.selectAll('trades').data(picData).enter()
      .append('text')
      .attr('class', 'trades')
      .attr('width', ww)
      .attr('height', hh)
      .style('font-size', `${fontSize}px`)
      .attr('transform', `translate(${xPos(1)},${yPos(0.75)})`)
      .call(d => d.each((dd, i, j) => {
        const here = d3.select(j[i]);
        for (let kk = 0; kk < picKeys.length; ++kk) {
          const t = (kk + 1) / picKeys.length;
          here.append('tspan')
            .attr('x', xPos(kk))
            .attr('y', yPos(i))
            .attr('keynumber', kk)
            .attr('class', 'spacer')
            .style('fill', `${d3.rgb(200 * (1 - t), t / 2 * 255, 200 * t)}`)
            .text(tableFormat(dd[picKeys[kk]]));
        }
      }));
  }
}
