import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css']
})
export class RadarComponent implements OnInit {
  radii: number[];
  constructor() { }

  ngOnInit() {
    this.picture();
  }
  picture() {
    this.radii = [144.3385566, 108.25391745, 72.1692783, 36.08463915, 0];
  }
}
