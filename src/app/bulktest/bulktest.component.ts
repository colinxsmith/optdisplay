import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { BulktradeComponent } from '../bulktrade/bulktrade.component';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';
@Component({
  selector: 'app-bulktest',
  templateUrl: './bulktest.component.html',
  styleUrls: ['./bulktest.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BulktestComponent implements OnInit {
  trade: BulktradeComponent;
  data = {
    id: 1,
    type: 'stockLevelTotalRisk',
    label: 'RISK',
    chartType: 'STATUS',
    monitorFlagCategory: [
      {
        id: 1,
        value: 13,
        outlierStatusType: 'NOT OUTLIER'
      },
      {
        id: 2,
        value: 10,
        outlierStatusType: 'ALMOST OUTLIER'
      },
      {
        id: 3,
        value: 55,
        outlierStatusType: 'OUTLIER'
      }
    ]
  };

  constructor(private element: ElementRef) { }

  ngOnInit() {

  }

}
