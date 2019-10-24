import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-bubbletable',
  templateUrl: './bubbletable.component.html',
  styleUrls: ['./bubbletable.component.css']
})
export class BubbletableComponent implements OnInit, OnChanges {
  @Input() DATA: {}[] = [];
  @Input() width = 800;
  @Input() height = 800;
  getKeys = Object.keys;
  side: number;
  keys: string[];
  constructor() {
    if (!this.DATA.length) {
      for (let i = 0; i < 10; ++i) {
        this.DATA.push({ name: `name${i + 1}`, x: i, y: i * i, z: i * i * i });
      }
    }
    this.side = this.height / this.DATA.length;
    this.keys = Object.keys(this.DATA[0]);
  }


  ngOnInit() {
    this.setup();
  }

  ngOnChanges() {
    this.setup();
  }
  setup() {
    console.log(this.DATA, this.width, this.height, this.side);
  }
}
