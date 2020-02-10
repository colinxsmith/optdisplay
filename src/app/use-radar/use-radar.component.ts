import { Component, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-use-radar',
  templateUrl: './use-radar.component.html',
  styleUrls: ['./use-radar.component.css']
})
export class UseRadarComponent {

  constructor(private element: ElementRef) { }

  scl = 1;
  scale = 1000;
  newscale(b: Event) {
    const back = b.target as HTMLButtonElement;
    this.scl = +back.value / this.scale;
  }
}
