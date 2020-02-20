import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-use-radar',
  templateUrl: './use-radar.component.html',
  styleUrls: ['./use-radar.component.css']
})
export class UseRadarComponent {

  constructor(private element: ElementRef) { }

  scl = 1;
  scale = 1000;
  newscale(b: Event, change: boolean) {
    const back = b.target as HTMLInputElement;
    this.scl = +back.value / this.scale;
  }
}
