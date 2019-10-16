import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-bulktest',
  templateUrl: './bulktest.component.html',
  styleUrls: ['./bulktest.component.css']
})
export class BulktestComponent implements OnInit {
  ttObj = d3.select('app-root').select('div.mainTip');
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
  DATA = {
    outlierStatusCounter: {
      title: 'Outlier Status Count',
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
      title: 'Post TRADE FLAGS',
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
  constructor(private element: ElementRef) { }

  ngOnInit() {

  }

}
