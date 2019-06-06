import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-disp',
  templateUrl: './disp.component.html',
  styleUrls: ['./disp.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DispComponent implements OnInit {

  updateLabel = 'Update';
  getLabel = 'Refresh';
  data: any = {};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getDat();
  }
  changeDat() {
    console.log(`${this.updateLabel} Pressed`);
    console.log(this.dataService.url);
    this.dataService.sendData('opt')
      .subscribe(ddd => {
        this.data = ddd;
        this.picture();
      });
  }
  getDat() {
    console.log(`${this.getLabel} Pressed`);
    console.log(this.dataService.url);
    this.dataService.getData()
      .subscribe(ddd => {
        this.data = ddd;
        this.picture();
      });
  }
  picture() {
    d3.select('app-disp').selectAll('svg').remove();
    d3.select('app-disp').selectAll('.text').remove();
    const ww = 760, hh = this.data.n * 15;
    const format = d3.format('0.5f');
    const svg = d3.select('app-disp').append('svg').attr('width', ww).attr('height', hh);
    const picData: { w: number, i: number }[] = [];
    this.data.w.forEach((d, i) => {
      picData.push({ w: this.data.w[i], i: this.data.initial[i] });
    });
    svg.selectAll('.trades').data(picData).enter()
      .append('text')
      .attr('class', 'trades')
      .attr('x', 10)
      .attr('y', (d, i) => (i + 1) * 15)
      .text((d, i) => `${i + 1}  ${format(d.w)} ${format(d.i)} ${format(d.w - d.i)}`);

  }
}
