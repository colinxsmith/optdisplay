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

  updateLabel = 'Button';
  initial: number[];
  w: number[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }
  changeDat() {
    console.log('Button Pressed');
    console.log(this.dataService.url);
    this.dataService.sendData('opt')
      .subscribe(ddd => {
        this.initial = ddd.initial;
        this.w = ddd.w;
        /*       this.dataService.getData()
                 .subscribe(dddd => {
                   console.log(dddd);
                   return dddd;
                 });*/
      });
  }
}
