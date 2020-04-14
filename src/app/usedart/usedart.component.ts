import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-usedart',
  templateUrl: './usedart.component.html',
  styleUrls: ['./usedart.component.css']
})
export class UsedartComponent implements OnInit {
  XX4 = 900;
  YY4 = 150;
  xl = d3.scaleLinear().range([0, this.XX4]);
  yl = d3.scaleLinear().range([this.YY4, 0]);
  L4DATA = [[0.68, 0.99, 0.7, 0.73], [0.34, 0.65, 0.6, 0.53], [0.05, 0.32, 0.1, 0.23]];
  L4CL = d3.scaleLinear<d3.RGBColor>()
    .domain([0, this.L4DATA.length - 1])
    .interpolate(d3.interpolateRgb.gamma(1.0))
    .range([d3.rgb(255, 255, 0), d3.rgb(24, 243, 186)])
    ;
  picdata1: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  picdata2: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  picdata3: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  picdata4: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  picdata5: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  esgColour = {
    0: d3.rgb(255, 59, 48),
    1: d3.rgb(255, 149, 0),
    2: d3.rgb(255, 230, 32),
    3: d3.rgb(0, 245, 234),
    4: d3.rgb(4, 222, 113),
    5: d3.rgb(90, 200, 2),
    8: d3.rgb(119, 119, 119),
    E: d3.rgb(120, 122, 255),
    S: d3.rgb(32, 148, 250),
    G: d3.rgb(90, 200, 250)
  };
  title5 = 'ESG | GOODNESS | FACTORS | COMPANIES';
  rawData5 = `gac,tac,sac,name,weight
  E,0,Environment,CROWN CASTLE INTL CORP,0.04
  E,0,Environment,CINCINNATI FINANCIAL CORP,0.05
  E,0,Pollution,VERTEX PHARMACEUTICALS INC,0.02
  E,0,Pollution,BERKSHIRE HATHAWAY INC-CL B,0.05
  E,0,Pollution,ACTIVISION BLIZZARD INC,0.03
  E,0,Pollution,FLEETCOR TECHNOLOGIES INC,0.04
  E,0,Resources,CROWN CASTLE INTL CORP,0.04
  E,0,Resources,ACTIVISION BLIZZARD INC,0.03
  E,0,Resources,FIRST REPUBLIC BANK/CA,0.05
  E,1,Environment,VERTEX PHARMACEUTICALS INC,0.02
  E,1,Environment,EXXON MOBIL CORP,0.03
  E,1,Environment,NUCOR CORP,0.07
  E,1,Environment,Facebook Inc.,0.07
  E,1,Environment,3M CO,0.08
  E,1,Environment,GILEAD SCIENCES INC,0.1
  E,1,Pollution,EXXON MOBIL CORP,0.03
  E,1,Pollution,CINCINNATI FINANCIAL CORP,0.05
  E,1,Resources,The Cooper Companies Inc.,0.06
  E,1,Resources,AMAZON.COM INC,0.08
  E,2,Environment,NETFLIX INC,0.06
  E,2,Environment,PHILLIPS 66,0.02
  E,2,Environment,FIRST REPUBLIC BANK/CA,0.05
  E,2,Environment,DUKE ENERGY CORP,0.02
  E,2,Environment,HALLIBURTON CO,0.03
  E,2,Pollution,NETFLIX INC,0.06
  E,2,Pollution,PHILLIPS 66,0.02
  E,2,Pollution,The Cooper Companies Inc.,0.06
  E,2,Pollution,3M CO,0.08
  E,2,Resources,BERKSHIRE HATHAWAY INC-CL B,0.05
  E,2,Resources,NETFLIX INC,0.06
  E,2,Resources,FLEETCOR TECHNOLOGIES INC,0.04
  E,2,Resources,DUKE ENERGY CORP,0.02
  E,2,Resources,Facebook Inc.,0.07
  E,2,Resources,3M CO,0.08
  E,3,Environment,FLEETCOR TECHNOLOGIES INC,0.04
  E,3,Environment,AMAZON.COM INC,0.08
  E,3,Environment,COPART INC,0.04
  E,3,Environment,ALLIANT ENERGY CORP,0.06
  E,3,Pollution,CROWN CASTLE INTL CORP,0.04
  E,3,Pollution,FIRST REPUBLIC BANK/CA,0.05
  E,3,Resources,VERTEX PHARMACEUTICALS INC,0.02
  E,3,Resources,NUCOR CORP,0.07
  E,3,Resources,COPART INC,0.04
  E,4,Environment,BERKSHIRE HATHAWAY INC-CL B,0.05
  E,4,Environment,ACTIVISION BLIZZARD INC,0.03
  E,4,Environment,The Cooper Companies Inc.,0.06
  E,4,Pollution,COPART INC,0.04
  E,4,Pollution,ALLIANT ENERGY CORP,0.06
  E,4,Pollution,Facebook Inc.,0.07
  E,4,Resources,HALLIBURTON CO,0.03
  E,4,Resources,CINCINNATI FINANCIAL CORP,0.05
  E,4,Resources,ALLIANT ENERGY CORP,0.06
  E,5,Pollution,NUCOR CORP,0.07
  E,5,Pollution,AMAZON.COM INC,0.08
  E,5,Pollution,DUKE ENERGY CORP,0.02
  E,5,Pollution,HALLIBURTON CO,0.03
  E,5,Resources,EXXON MOBIL CORP,0.03
  E,5,Resources,PHILLIPS 66,0.02
  E,8,Pollution,GILEAD SCIENCES INC,0.1
  E,8,Resources,GILEAD SCIENCES INC,0.1
  G,0,Board,DUKE ENERGY CORP,0.02
  G,0,Disclosure,FIRST REPUBLIC BANK/CA,0.05
  G,0,Disclosure,NUCOR CORP,0.07
  G,0,Disclosure,ALLIANT ENERGY CORP,0.06
  G,0,Ethics,CROWN CASTLE INTL CORP,0.04
  G,0,Ethics,EXXON MOBIL CORP,0.03
  G,0,Ethics,The Cooper Companies Inc.,0.06
  G,0,Ethics,DUKE ENERGY CORP,0.02
  G,0,Ethics,HALLIBURTON CO,0.03
  G,0,Ethics,CINCINNATI FINANCIAL CORP,0.05
  G,0,Sustain Pol,CROWN CASTLE INTL CORP,0.04
  G,0,Sustain Pol,CINCINNATI FINANCIAL CORP,0.05
  G,1,Board,CROWN CASTLE INTL CORP,0.04
  G,1,Board,FIRST REPUBLIC BANK/CA,0.05
  G,1,Disclosure,NETFLIX INC,0.06
  G,1,Disclosure,PHILLIPS 66,0.02
  G,1,Disclosure,AMAZON.COM INC,0.08
  G,1,Disclosure,DUKE ENERGY CORP,0.02
  G,1,Ethics,VERTEX PHARMACEUTICALS INC,0.02
  G,1,Sustain Pol,BERKSHIRE HATHAWAY INC-CL B,0.05
  G,1,Sustain Pol,FLEETCOR TECHNOLOGIES INC,0.04
  G,1,Sustain Pol,DUKE ENERGY CORP,0.02
  G,1,Sustain Pol,3M CO,0.08
  G,2,Board,VERTEX PHARMACEUTICALS INC,0.02
  G,2,Board,AMAZON.COM INC,0.08
  G,2,Board,3M CO,0.08
  G,2,Disclosure,EXXON MOBIL CORP,0.03
  G,2,Disclosure,The Cooper Companies Inc.,0.06
  G,2,Disclosure,Facebook Inc.,0.07
  G,2,Sustain Pol,VERTEX PHARMACEUTICALS INC,0.02
  G,2,Sustain Pol,NETFLIX INC,0.06
  G,2,Sustain Pol,PHILLIPS 66,0.02
  G,2,Sustain Pol,HALLIBURTON CO,0.03
  G,2,Sustain Pol,COPART INC,0.04
  G,3,Board,FLEETCOR TECHNOLOGIES INC,0.04
  G,3,Board,The Cooper Companies Inc.,0.06
  G,3,Board,Facebook Inc.,0.07
  G,3,Disclosure,VERTEX PHARMACEUTICALS INC,0.02
  G,3,Disclosure,BERKSHIRE HATHAWAY INC-CL B,0.05
  G,3,Disclosure,ACTIVISION BLIZZARD INC,0.03
  G,3,Disclosure,COPART INC,0.04
  G,3,Disclosure,CINCINNATI FINANCIAL CORP,0.05
  G,3,Ethics,BERKSHIRE HATHAWAY INC-CL B,0.05
  G,3,Ethics,NETFLIX INC,0.06
  G,3,Ethics,ACTIVISION BLIZZARD INC,0.03
  G,3,Ethics,FIRST REPUBLIC BANK/CA,0.05
  G,3,Ethics,AMAZON.COM INC,0.08
  G,3,Ethics,COPART INC,0.04
  G,3,Sustain Pol,AMAZON.COM INC,0.08
  G,3,Sustain Pol,Facebook Inc.,0.07
  G,4,Board,EXXON MOBIL CORP,0.03
  G,4,Board,NETFLIX INC,0.06
  G,4,Board,PHILLIPS 66,0.02
  G,4,Board,ACTIVISION BLIZZARD INC,0.03
  G,4,Board,HALLIBURTON CO,0.03
  G,4,Board,COPART INC,0.04
  G,4,Board,CINCINNATI FINANCIAL CORP,0.05
  G,4,Disclosure,HALLIBURTON CO,0.03
  G,4,Ethics,PHILLIPS 66,0.02
  G,4,Ethics,FLEETCOR TECHNOLOGIES INC,0.04
  G,4,Ethics,NUCOR CORP,0.07
  G,4,Ethics,ALLIANT ENERGY CORP,0.06
  G,4,Ethics,Facebook Inc.,0.07
  G,4,Sustain Pol,EXXON MOBIL CORP,0.03
  G,4,Sustain Pol,FIRST REPUBLIC BANK/CA,0.05
  G,5,Board,BERKSHIRE HATHAWAY INC-CL B,0.05
  G,5,Board,NUCOR CORP,0.07
  G,5,Board,ALLIANT ENERGY CORP,0.06
  G,5,Disclosure,CROWN CASTLE INTL CORP,0.04
  G,5,Disclosure,FLEETCOR TECHNOLOGIES INC,0.04
  G,5,Disclosure,3M CO,0.08
  G,5,Ethics,3M CO,0.08
  G,5,Sustain Pol,ACTIVISION BLIZZARD INC,0.03
  G,5,Sustain Pol,The Cooper Companies Inc.,0.06
  G,5,Sustain Pol,NUCOR CORP,0.07
  G,5,Sustain Pol,ALLIANT ENERGY CORP,0.06
  G,8,Board,GILEAD SCIENCES INC,0.1
  G,8,Disclosure,GILEAD SCIENCES INC,0.1
  G,8,Ethics,GILEAD SCIENCES INC,0.1
  G,8,Sustain Pol,GILEAD SCIENCES INC,0.1
  S,0,Community,PHILLIPS 66,0.02
  S,0,Community,FLEETCOR TECHNOLOGIES INC,0.04
  S,0,Community,The Cooper Companies Inc.,0.06
  S,0,Community,DUKE ENERGY CORP,0.02
  S,0,Diversity,VERTEX PHARMACEUTICALS INC,0.02
  S,0,Diversity,BERKSHIRE HATHAWAY INC-CL B,0.05
  S,0,Diversity,EXXON MOBIL CORP,0.03
  S,0,Diversity,The Cooper Companies Inc.,0.06
  S,0,Diversity,ALLIANT ENERGY CORP,0.06
  S,0,Employee,EXXON MOBIL CORP,0.03
  S,0,Employee,NUCOR CORP,0.07
  S,0,H Rights,BERKSHIRE HATHAWAY INC-CL B,0.05
  S,0,H Rights,The Cooper Companies Inc.,0.06
  S,0,H Rights,DUKE ENERGY CORP,0.02
  S,0,H Rights,3M CO,0.08
  S,0,Work,EXXON MOBIL CORP,0.03
  S,0,Work,PHILLIPS 66,0.02
  S,0,Work,The Cooper Companies Inc.,0.06
  S,0,Work,NUCOR CORP,0.07
  S,0,Work,HALLIBURTON CO,0.03
  S,0,Work,ALLIANT ENERGY CORP,0.06
  S,0,Work,Facebook Inc.,0.07
  S,1,Diversity,AMAZON.COM INC,0.08
  S,1,Diversity,3M CO,0.08
  S,1,Employee,HALLIBURTON CO,0.03
  S,1,Employee,COPART INC,0.04
  S,1,Employee,Facebook Inc.,0.07
  S,1,H Rights,FLEETCOR TECHNOLOGIES INC,0.04
  S,1,H Rights,Facebook Inc.,0.07
  S,2,Community,BERKSHIRE HATHAWAY INC-CL B,0.05
  S,2,Community,NETFLIX INC,0.06
  S,2,Community,AMAZON.COM INC,0.08
  S,2,Community,ALLIANT ENERGY CORP,0.06
  S,2,Diversity,PHILLIPS 66,0.02
  S,2,Employee,VERTEX PHARMACEUTICALS INC,0.02
  S,2,Employee,FLEETCOR TECHNOLOGIES INC,0.04
  S,2,Employee,FIRST REPUBLIC BANK/CA,0.05
  S,2,Employee,The Cooper Companies Inc.,0.06
  S,2,Employee,ALLIANT ENERGY CORP,0.06
  S,2,H Rights,NETFLIX INC,0.06
  S,2,H Rights,ACTIVISION BLIZZARD INC,0.03
  S,2,H Rights,HALLIBURTON CO,0.03
  S,2,Work,CROWN CASTLE INTL CORP,0.04
  S,2,Work,ACTIVISION BLIZZARD INC,0.03
  S,2,Work,FLEETCOR TECHNOLOGIES INC,0.04
  S,2,Work,DUKE ENERGY CORP,0.02
  S,3,Community,CROWN CASTLE INTL CORP,0.04
  S,3,Community,EXXON MOBIL CORP,0.03
  S,3,Community,HALLIBURTON CO,0.03
  S,3,Diversity,CROWN CASTLE INTL CORP,0.04
  S,3,Diversity,ACTIVISION BLIZZARD INC,0.03
  S,3,Diversity,DUKE ENERGY CORP,0.02
  S,3,Diversity,CINCINNATI FINANCIAL CORP,0.05
  S,3,Employee,CROWN CASTLE INTL CORP,0.04
  S,3,Employee,3M CO,0.08
  S,3,H Rights,VERTEX PHARMACEUTICALS INC,0.02
  S,3,H Rights,FIRST REPUBLIC BANK/CA,0.05
  S,3,H Rights,NUCOR CORP,0.07
  S,3,H Rights,COPART INC,0.04
  S,3,Work,COPART INC,0.04
  S,4,Community,VERTEX PHARMACEUTICALS INC,0.02
  S,4,Diversity,FLEETCOR TECHNOLOGIES INC,0.04
  S,4,Diversity,FIRST REPUBLIC BANK/CA,0.05
  S,4,Diversity,NUCOR CORP,0.07
  S,4,Diversity,HALLIBURTON CO,0.03
  S,4,Diversity,COPART INC,0.04
  S,4,Employee,BERKSHIRE HATHAWAY INC-CL B,0.05
  S,4,Employee,PHILLIPS 66,0.02
  S,4,H Rights,CROWN CASTLE INTL CORP,0.04
  S,4,H Rights,AMAZON.COM INC,0.08
  S,4,H Rights,ALLIANT ENERGY CORP,0.06
  S,4,Work,VERTEX PHARMACEUTICALS INC,0.02
  S,4,Work,BERKSHIRE HATHAWAY INC-CL B,0.05
  S,4,Work,FIRST REPUBLIC BANK/CA,0.05
  S,4,Work,AMAZON.COM INC,0.08
  S,4,Work,CINCINNATI FINANCIAL CORP,0.05
  S,5,Community,ACTIVISION BLIZZARD INC,0.03
  S,5,Community,FIRST REPUBLIC BANK/CA,0.05
  S,5,Community,NUCOR CORP,0.07
  S,5,Community,COPART INC,0.04
  S,5,Community,CINCINNATI FINANCIAL CORP,0.05
  S,5,Community,Facebook Inc.,0.07
  S,5,Community,3M CO,0.08
  S,5,Diversity,NETFLIX INC,0.06
  S,5,Diversity,Facebook Inc.,0.07
  S,5,Employee,NETFLIX INC,0.06
  S,5,Employee,ACTIVISION BLIZZARD INC,0.03
  S,5,Employee,AMAZON.COM INC,0.08
  S,5,Employee,DUKE ENERGY CORP,0.02
  S,5,Employee,CINCINNATI FINANCIAL CORP,0.05
  S,5,H Rights,EXXON MOBIL CORP,0.03
  S,5,H Rights,PHILLIPS 66,0.02
  S,5,H Rights,CINCINNATI FINANCIAL CORP,0.05
  S,5,Work,NETFLIX INC,0.06
  S,5,Work,3M CO,0.08
  S,8,Community,GILEAD SCIENCES INC,0.1
  S,8,Diversity,GILEAD SCIENCES INC,0.1
  S,8,Employee,GILEAD SCIENCES INC,0.1
  S,8,H Rights,GILEAD SCIENCES INC,0.1
  S,8,Work,GILEAD SCIENCES INC,0.1
  `;
  title4 = 'ESG | FACTORS | GOODNESS | COMPANIES';
  rawData4 = `gac,tac,sac,name,weight
E,Environment,0,CROWN CASTLE INTL CORP,0.04
E,Environment,0,CINCINNATI FINANCIAL CORP,0.05
E,Environment,1,VERTEX PHARMACEUTICALS INC,0.02
E,Environment,1,EXXON MOBIL CORP,0.03
E,Environment,1,NUCOR CORP,0.07
E,Environment,1,Facebook Inc.,0.07
E,Environment,1,3M CO,0.08
E,Environment,1,GILEAD SCIENCES INC,0.1
E,Environment,2,NETFLIX INC,0.06
E,Environment,2,PHILLIPS 66,0.02
E,Environment,2,FIRST REPUBLIC BANK/CA,0.05
E,Environment,2,DUKE ENERGY CORP,0.02
E,Environment,2,HALLIBURTON CO,0.03
E,Environment,3,FLEETCOR TECHNOLOGIES INC,0.04
E,Environment,3,AMAZON.COM INC,0.08
E,Environment,3,COPART INC,0.04
E,Environment,3,ALLIANT ENERGY CORP,0.06
E,Environment,4,BERKSHIRE HATHAWAY INC-CL B,0.05
E,Environment,4,ACTIVISION BLIZZARD INC,0.03
E,Environment,4,The Cooper Companies Inc.,0.06
E,Pollution,0,VERTEX PHARMACEUTICALS INC,0.02
E,Pollution,0,BERKSHIRE HATHAWAY INC-CL B,0.05
E,Pollution,0,ACTIVISION BLIZZARD INC,0.03
E,Pollution,0,FLEETCOR TECHNOLOGIES INC,0.04
E,Pollution,1,EXXON MOBIL CORP,0.03
E,Pollution,1,CINCINNATI FINANCIAL CORP,0.05
E,Pollution,2,NETFLIX INC,0.06
E,Pollution,2,PHILLIPS 66,0.02
E,Pollution,2,The Cooper Companies Inc.,0.06
E,Pollution,2,3M CO,0.08
E,Pollution,3,CROWN CASTLE INTL CORP,0.04
E,Pollution,3,FIRST REPUBLIC BANK/CA,0.05
E,Pollution,4,COPART INC,0.04
E,Pollution,4,ALLIANT ENERGY CORP,0.06
E,Pollution,4,Facebook Inc.,0.07
E,Pollution,5,NUCOR CORP,0.07
E,Pollution,5,AMAZON.COM INC,0.08
E,Pollution,5,DUKE ENERGY CORP,0.02
E,Pollution,5,HALLIBURTON CO,0.03
E,Pollution,8,GILEAD SCIENCES INC,0.1
E,Resources,0,CROWN CASTLE INTL CORP,0.04
E,Resources,0,ACTIVISION BLIZZARD INC,0.03
E,Resources,0,FIRST REPUBLIC BANK/CA,0.05
E,Resources,1,The Cooper Companies Inc.,0.06
E,Resources,1,AMAZON.COM INC,0.08
E,Resources,2,BERKSHIRE HATHAWAY INC-CL B,0.05
E,Resources,2,NETFLIX INC,0.06
E,Resources,2,FLEETCOR TECHNOLOGIES INC,0.04
E,Resources,2,DUKE ENERGY CORP,0.02
E,Resources,2,Facebook Inc.,0.07
E,Resources,2,3M CO,0.08
E,Resources,3,VERTEX PHARMACEUTICALS INC,0.02
E,Resources,3,NUCOR CORP,0.07
E,Resources,3,COPART INC,0.04
E,Resources,4,HALLIBURTON CO,0.03
E,Resources,4,CINCINNATI FINANCIAL CORP,0.05
E,Resources,4,ALLIANT ENERGY CORP,0.06
E,Resources,5,EXXON MOBIL CORP,0.03
E,Resources,5,PHILLIPS 66,0.02
E,Resources,8,GILEAD SCIENCES INC,0.1
G,Board,0,DUKE ENERGY CORP,0.02
G,Board,1,CROWN CASTLE INTL CORP,0.04
G,Board,1,FIRST REPUBLIC BANK/CA,0.05
G,Board,2,VERTEX PHARMACEUTICALS INC,0.02
G,Board,2,AMAZON.COM INC,0.08
G,Board,2,3M CO,0.08
G,Board,3,FLEETCOR TECHNOLOGIES INC,0.04
G,Board,3,The Cooper Companies Inc.,0.06
G,Board,3,Facebook Inc.,0.07
G,Board,4,EXXON MOBIL CORP,0.03
G,Board,4,NETFLIX INC,0.06
G,Board,4,PHILLIPS 66,0.02
G,Board,4,ACTIVISION BLIZZARD INC,0.03
G,Board,4,HALLIBURTON CO,0.03
G,Board,4,COPART INC,0.04
G,Board,4,CINCINNATI FINANCIAL CORP,0.05
G,Board,5,BERKSHIRE HATHAWAY INC-CL B,0.05
G,Board,5,NUCOR CORP,0.07
G,Board,5,ALLIANT ENERGY CORP,0.06
G,Board,8,GILEAD SCIENCES INC,0.1
G,Disclosure,0,FIRST REPUBLIC BANK/CA,0.05
G,Disclosure,0,NUCOR CORP,0.07
G,Disclosure,0,ALLIANT ENERGY CORP,0.06
G,Disclosure,1,NETFLIX INC,0.06
G,Disclosure,1,PHILLIPS 66,0.02
G,Disclosure,1,AMAZON.COM INC,0.08
G,Disclosure,1,DUKE ENERGY CORP,0.02
G,Disclosure,2,EXXON MOBIL CORP,0.03
G,Disclosure,2,The Cooper Companies Inc.,0.06
G,Disclosure,2,Facebook Inc.,0.07
G,Disclosure,3,VERTEX PHARMACEUTICALS INC,0.02
G,Disclosure,3,BERKSHIRE HATHAWAY INC-CL B,0.05
G,Disclosure,3,ACTIVISION BLIZZARD INC,0.03
G,Disclosure,3,COPART INC,0.04
G,Disclosure,3,CINCINNATI FINANCIAL CORP,0.05
G,Disclosure,4,HALLIBURTON CO,0.03
G,Disclosure,5,CROWN CASTLE INTL CORP,0.04
G,Disclosure,5,FLEETCOR TECHNOLOGIES INC,0.04
G,Disclosure,5,3M CO,0.08
G,Disclosure,8,GILEAD SCIENCES INC,0.1
G,Ethics,0,CROWN CASTLE INTL CORP,0.04
G,Ethics,0,EXXON MOBIL CORP,0.03
G,Ethics,0,The Cooper Companies Inc.,0.06
G,Ethics,0,DUKE ENERGY CORP,0.02
G,Ethics,0,HALLIBURTON CO,0.03
G,Ethics,0,CINCINNATI FINANCIAL CORP,0.05
G,Ethics,1,VERTEX PHARMACEUTICALS INC,0.02
G,Ethics,3,BERKSHIRE HATHAWAY INC-CL B,0.05
G,Ethics,3,NETFLIX INC,0.06
G,Ethics,3,ACTIVISION BLIZZARD INC,0.03
G,Ethics,3,FIRST REPUBLIC BANK/CA,0.05
G,Ethics,3,AMAZON.COM INC,0.08
G,Ethics,3,COPART INC,0.04
G,Ethics,4,PHILLIPS 66,0.02
G,Ethics,4,FLEETCOR TECHNOLOGIES INC,0.04
G,Ethics,4,NUCOR CORP,0.07
G,Ethics,4,ALLIANT ENERGY CORP,0.06
G,Ethics,4,Facebook Inc.,0.07
G,Ethics,5,3M CO,0.08
G,Ethics,8,GILEAD SCIENCES INC,0.1
G,Sustain Pol,0,CROWN CASTLE INTL CORP,0.04
G,Sustain Pol,0,CINCINNATI FINANCIAL CORP,0.05
G,Sustain Pol,1,BERKSHIRE HATHAWAY INC-CL B,0.05
G,Sustain Pol,1,FLEETCOR TECHNOLOGIES INC,0.04
G,Sustain Pol,1,DUKE ENERGY CORP,0.02
G,Sustain Pol,1,3M CO,0.08
G,Sustain Pol,2,VERTEX PHARMACEUTICALS INC,0.02
G,Sustain Pol,2,NETFLIX INC,0.06
G,Sustain Pol,2,PHILLIPS 66,0.02
G,Sustain Pol,2,HALLIBURTON CO,0.03
G,Sustain Pol,2,COPART INC,0.04
G,Sustain Pol,3,AMAZON.COM INC,0.08
G,Sustain Pol,3,Facebook Inc.,0.07
G,Sustain Pol,4,EXXON MOBIL CORP,0.03
G,Sustain Pol,4,FIRST REPUBLIC BANK/CA,0.05
G,Sustain Pol,5,ACTIVISION BLIZZARD INC,0.03
G,Sustain Pol,5,The Cooper Companies Inc.,0.06
G,Sustain Pol,5,NUCOR CORP,0.07
G,Sustain Pol,5,ALLIANT ENERGY CORP,0.06
G,Sustain Pol,8,GILEAD SCIENCES INC,0.1
S,Community,0,PHILLIPS 66,0.02
S,Community,0,FLEETCOR TECHNOLOGIES INC,0.04
S,Community,0,The Cooper Companies Inc.,0.06
S,Community,0,DUKE ENERGY CORP,0.02
S,Community,2,BERKSHIRE HATHAWAY INC-CL B,0.05
S,Community,2,NETFLIX INC,0.06
S,Community,2,AMAZON.COM INC,0.08
S,Community,2,ALLIANT ENERGY CORP,0.06
S,Community,3,CROWN CASTLE INTL CORP,0.04
S,Community,3,EXXON MOBIL CORP,0.03
S,Community,3,HALLIBURTON CO,0.03
S,Community,4,VERTEX PHARMACEUTICALS INC,0.02
S,Community,5,ACTIVISION BLIZZARD INC,0.03
S,Community,5,FIRST REPUBLIC BANK/CA,0.05
S,Community,5,NUCOR CORP,0.07
S,Community,5,COPART INC,0.04
S,Community,5,CINCINNATI FINANCIAL CORP,0.05
S,Community,5,Facebook Inc.,0.07
S,Community,5,3M CO,0.08
S,Community,8,GILEAD SCIENCES INC,0.1
S,Diversity,0,VERTEX PHARMACEUTICALS INC,0.02
S,Diversity,0,BERKSHIRE HATHAWAY INC-CL B,0.05
S,Diversity,0,EXXON MOBIL CORP,0.03
S,Diversity,0,The Cooper Companies Inc.,0.06
S,Diversity,0,ALLIANT ENERGY CORP,0.06
S,Diversity,1,AMAZON.COM INC,0.08
S,Diversity,1,3M CO,0.08
S,Diversity,2,PHILLIPS 66,0.02
S,Diversity,3,CROWN CASTLE INTL CORP,0.04
S,Diversity,3,ACTIVISION BLIZZARD INC,0.03
S,Diversity,3,DUKE ENERGY CORP,0.02
S,Diversity,3,CINCINNATI FINANCIAL CORP,0.05
S,Diversity,4,FLEETCOR TECHNOLOGIES INC,0.04
S,Diversity,4,FIRST REPUBLIC BANK/CA,0.05
S,Diversity,4,NUCOR CORP,0.07
S,Diversity,4,HALLIBURTON CO,0.03
S,Diversity,4,COPART INC,0.04
S,Diversity,5,NETFLIX INC,0.06
S,Diversity,5,Facebook Inc.,0.07
S,Diversity,8,GILEAD SCIENCES INC,0.1
S,Employee,0,EXXON MOBIL CORP,0.03
S,Employee,0,NUCOR CORP,0.07
S,Employee,1,HALLIBURTON CO,0.03
S,Employee,1,COPART INC,0.04
S,Employee,1,Facebook Inc.,0.07
S,Employee,2,VERTEX PHARMACEUTICALS INC,0.02
S,Employee,2,FLEETCOR TECHNOLOGIES INC,0.04
S,Employee,2,FIRST REPUBLIC BANK/CA,0.05
S,Employee,2,The Cooper Companies Inc.,0.06
S,Employee,2,ALLIANT ENERGY CORP,0.06
S,Employee,3,CROWN CASTLE INTL CORP,0.04
S,Employee,3,3M CO,0.08
S,Employee,4,BERKSHIRE HATHAWAY INC-CL B,0.05
S,Employee,4,PHILLIPS 66,0.02
S,Employee,5,NETFLIX INC,0.06
S,Employee,5,ACTIVISION BLIZZARD INC,0.03
S,Employee,5,AMAZON.COM INC,0.08
S,Employee,5,DUKE ENERGY CORP,0.02
S,Employee,5,CINCINNATI FINANCIAL CORP,0.05
S,Employee,8,GILEAD SCIENCES INC,0.1
S,H Rights,0,BERKSHIRE HATHAWAY INC-CL B,0.05
S,H Rights,0,The Cooper Companies Inc.,0.06
S,H Rights,0,DUKE ENERGY CORP,0.02
S,H Rights,0,3M CO,0.08
S,H Rights,1,FLEETCOR TECHNOLOGIES INC,0.04
S,H Rights,1,Facebook Inc.,0.07
S,H Rights,2,NETFLIX INC,0.06
S,H Rights,2,ACTIVISION BLIZZARD INC,0.03
S,H Rights,2,HALLIBURTON CO,0.03
S,H Rights,3,VERTEX PHARMACEUTICALS INC,0.02
S,H Rights,3,FIRST REPUBLIC BANK/CA,0.05
S,H Rights,3,NUCOR CORP,0.07
S,H Rights,3,COPART INC,0.04
S,H Rights,4,CROWN CASTLE INTL CORP,0.04
S,H Rights,4,AMAZON.COM INC,0.08
S,H Rights,4,ALLIANT ENERGY CORP,0.06
S,H Rights,5,EXXON MOBIL CORP,0.03
S,H Rights,5,PHILLIPS 66,0.02
S,H Rights,5,CINCINNATI FINANCIAL CORP,0.05
S,H Rights,8,GILEAD SCIENCES INC,0.1
S,Work,0,EXXON MOBIL CORP,0.03
S,Work,0,PHILLIPS 66,0.02
S,Work,0,The Cooper Companies Inc.,0.06
S,Work,0,NUCOR CORP,0.07
S,Work,0,HALLIBURTON CO,0.03
S,Work,0,ALLIANT ENERGY CORP,0.06
S,Work,0,Facebook Inc.,0.07
S,Work,2,CROWN CASTLE INTL CORP,0.04
S,Work,2,ACTIVISION BLIZZARD INC,0.03
S,Work,2,FLEETCOR TECHNOLOGIES INC,0.04
S,Work,2,DUKE ENERGY CORP,0.02
S,Work,3,COPART INC,0.04
S,Work,4,VERTEX PHARMACEUTICALS INC,0.02
S,Work,4,BERKSHIRE HATHAWAY INC-CL B,0.05
S,Work,4,FIRST REPUBLIC BANK/CA,0.05
S,Work,4,AMAZON.COM INC,0.08
S,Work,4,CINCINNATI FINANCIAL CORP,0.05
S,Work,5,NETFLIX INC,0.06
S,Work,5,3M CO,0.08
S,Work,8,GILEAD SCIENCES INC,0.1
`;
  esgColour3 = {
    CO2: d3.rgb(187, 172, 172)
  }
  title3 = 'WEIGHTED CARBON EMISSSIONS CURRENT';
  rawData3 = `gac,name,weight
  CO2,CROWN CASTLE INTL CORP,0.3
  CO2,VERTEX PHARMACEUTICALS INC,0.1
  CO2,EXXON MOBIL CORP,0.15
  CO2,PHILLIPS 66,0.1
  CO2,ACTIVISION BLIZZARD INC,0.15
  CO2,FLEETCOR TECHNOLOGIES INC,0.05
  CO2,The Cooper Companies Inc.,0.05
  CO2,NUCOR CORP,0.05
  CO2,BERKSHIRE HATHAWAY INC-CL B,0.24
  CO2,NETFLIX INC,0.24
  CO2,FIRST REPUBLIC BANK/CA,0.04
  CO2,COPART INC,0.12
  CO2,AMAZON.COM INC,0.06
  CO2,DUKE ENERGY CORP,0.03
  CO2,HALLIBURTON CO,0.03
  CO2,CINCINNATI FINANCIAL CORP,0.03
  CO2,ALLIANT ENERGY CORP,0.06
  CO2,VERISK ANALYTICS INC,0.03
  CO2,ROYAL CARIBBEAN CRUISES LTD,0.03
  CO2,DOVER CORP,0.03
  CO2,KANSAS CITY SOUTHERN,0
  CO2,WATERS CORP,0.03
  CO2,PVH CORP,0.06
  CO2,Facebook Inc.,0.02
  CO2,3M CO,0.02
  CO2,GILEAD SCIENCES INC,0.02
  CO2,CHUBB LIMITED,0.02
  CO2,PARKER-HANNIFIN CORP COMMON STOCK USD 0.5,0.02
  CO2,Alexandria Real Estate Equitie,0
  CO2,BROWN-FORMAN CORP,0.04
  CO2,NOBLE ENERGY INC,0.04
  CO2,JUNIPER NETWORKS INC,0.04
  CO2,TAPESTRY INC COMMON STOCK USD.01,0.04
  CO2,COCA-COLA CO/THE,0
  CO2,UNION PACIFIC CORP,0.02
  CO2,LINCOLN NATIONAL CORP,0.04
  CO2,WELLS FARGO & CO,0.02
  CO2,CISCO SYSTEMS INC,0
  CO2,BOEING CO,0.01
  CO2,BRISTOL-MYERS SQUIBB CO,0.01
  CO2,TEXAS INSTRUMENTS INC,0.01
  CO2,BEST BUY CO INC,0
  CO2,METTLER-TOLEDO,0.02
  CO2,WW GRAINGER INC,0.01
  CO2,SEAGATE TECHNOLOGY,0.02
  CO2,DARDEN RESTAURANTS INC,0.02
  CO2,HASBRO INC,0
  CO2,DENTSPLY SIRONA INC,0.01
  CO2,HOST HOTELS & RESORTS INC,0.02
  CO2,COMERICA INC,0.02
  CO2,CAMPBELL SOUP CO,0.02
  CO2,MCDONALDS CORP,0.01
  CO2,HP INC,0.01
  CO2,HEWLETT PACKA,0.02
  CO2,CLOROX COMPANY,0
  CO2,Xylem Inc/NY,0.02
  CO2,GAP INC/THE,0.02
  CO2,MICROSOFT CORP,0
  CO2,LINDE PLC COMMON STOCK EUR.001,-0.03
  CO2,BOOKING HOLDINGS INC,-0.03
  CO2,VIACOMCBS INC,-0.12
  `;
  esgColour2 = {
    1: '#6af36a',
    2: 'palegreen',
    3: 'lightgrey',
    5: 'grey',
    4: 'darkgrey',
    0: '#716868',
    '-3': '#f3ebeb'
  };
  title2 = 'CARBON EMISSIONS CURRENT';
  rawData2 = `gac,name,weight
  5,CROWN CASTLE INTL CORP,0.06
  5,VERTEX PHARMACEUTICALS INC,0.02
  5,EXXON MOBIL CORP,0.03
  5,PHILLIPS 66,0.02
  5,ACTIVISION BLIZZARD INC,0.03
  5,FLEETCOR TECHNOLOGIES INC,0.01
  5,The Cooper Companies Inc.,0.01
  5,NUCOR CORP,0.01
  4,BERKSHIRE HATHAWAY INC-CL B,0.06
  4,NETFLIX INC,0.06
  4,FIRST REPUBLIC BANK/CA,0.01
  4,COPART INC,0.03
  3,AMAZON.COM INC,0.02
  3,DUKE ENERGY CORP,0.01
  3,HALLIBURTON CO,0.01
  3,CINCINNATI FINANCIAL CORP,0.01
  3,ALLIANT ENERGY CORP,0.02
  3,VERISK ANALYTICS INC,0.01
  3,ROYAL CARIBBEAN CRUISES LTD,0.01
  3,DOVER CORP,0.01
  3,KANSAS CITY SOUTHERN,0
  3,WATERS CORP,0.01
  3,PVH CORP,0.02
  2,Facebook Inc.,0.01
  2,3M CO,0.01
  2,GILEAD SCIENCES INC,0.01
  2,CHUBB LIMITED,0.01
  2,PARKER-HANNIFIN CORP COMMON STOCK USD 0.5,0.01
  2,Alexandria Real Estate Equitie,0
  2,BROWN-FORMAN CORP,0.02
  2,NOBLE ENERGY INC,0.02
  2,JUNIPER NETWORKS INC,0.02
  2,TAPESTRY INC COMMON STOCK USD.01,0.02
  2,COCA-COLA CO/THE,0
  2,UNION PACIFIC CORP,0.01
  2,LINCOLN NATIONAL CORP,0.02
  1,WELLS FARGO & CO,0.02
  1,CISCO SYSTEMS INC,0
  1,BOEING CO,0.01
  1,BRISTOL-MYERS SQUIBB CO,0.01
  1,TEXAS INSTRUMENTS INC,0.01
  1,BEST BUY CO INC,0
  1,METTLER-TOLEDO,0.02
  1,WW GRAINGER INC,0.01
  1,SEAGATE TECHNOLOGY,0.02
  1,DARDEN RESTAURANTS INC,0.02
  1,HASBRO INC,0
  1,DENTSPLY SIRONA INC,0.01
  1,HOST HOTELS & RESORTS INC,0.02
  1,COMERICA INC,0.02
  1,CAMPBELL SOUP CO,0.02
  1,MCDONALDS CORP,0.01
  1,HP INC,0.01
  1,HEWLETT PACKA,0.02
  1,CLOROX COMPANY,0
  1,Xylem Inc/NY,0.02
  1,GAP INC/THE,0.02
  0,MICROSOFT CORP,0.01
  -3,LINDE PLC COMMON STOCK EUR.001,0.01
  -3,BOOKING HOLDINGS INC,0.01
  -3,VIACOMCBS INC,0.04
  `;
  title1 = 'CURRENT';
  rawData1 = `gac,tac,name,weight
  E,0,CROWN CASTLE INTL CORP,0.06
  E,0,VERTEX PHARMACEUTICALS INC,0.02
  E,1,BERKSHIRE HATHAWAY INC-CL B,0.06
  E,1,EXXON MOBIL CORP,0.03
  E,1,NETFLIX INC,0.06
  E,1,PHILLIPS 66,0.02
  E,1,ACTIVISION BLIZZARD INC,0.03
  E,1,FLEETCOR TECHNOLOGIES INC,0.01
  E,1,FIRST REPUBLIC BANK/CA,0.01
  E,1,The Cooper Companies Inc.,0.01
  E,1,NUCOR CORP,0.01
  E,2,AMAZON.COM INC,0.02
  E,2,DUKE ENERGY CORP,0.01
  E,2,HALLIBURTON CO,0.01
  E,2,COPART INC,0.03
  E,2,CINCINNATI FINANCIAL CORP,0.01
  E,2,ALLIANT ENERGY CORP,0.02
  E,3,Facebook Inc.,0.01
  E,3,3M CO,0.01
  E,3,GILEAD SCIENCES INC,0.01
  E,3,CHUBB LIMITED,0.01
  E,3,PARKER-HANNIFIN CORP COMMON STOCK USD 0.5,0.01
  E,3,VERISK ANALYTICS INC,0.01
  E,3,ROYAL CARIBBEAN CRUISES LTD,0.01
  E,3,Alexandria Real Estate Equitie,0
  E,3,DOVER CORP,0.01
  E,3,KANSAS CITY SOUTHERN,0
  E,3,WATERS CORP,0.01
  E,3,BROWN-FORMAN CORP,0.02
  E,3,NOBLE ENERGY INC,0.02
  E,3,JUNIPER NETWORKS INC,0.02
  E,3,TAPESTRY INC COMMON STOCK USD.01,0.02
  E,3,PVH CORP,0.02
  E,4,COCA-COLA CO/THE,0
  E,4,WELLS FARGO & CO,0.02
  E,4,CISCO SYSTEMS INC,0
  E,4,BOEING CO,0.01
  E,4,BRISTOL-MYERS SQUIBB CO,0.01
  E,4,UNION PACIFIC CORP,0.01
  E,4,TEXAS INSTRUMENTS INC,0.01
  E,4,BEST BUY CO INC,0
  E,4,METTLER-TOLEDO,0.02
  E,4,WW GRAINGER INC,0.01
  E,4,SEAGATE TECHNOLOGY,0.02
  E,4,DARDEN RESTAURANTS INC,0.02
  E,4,HASBRO INC,0
  E,4,DENTSPLY SIRONA INC,0.01
  E,4,HOST HOTELS & RESORTS INC,0.02
  E,4,LINCOLN NATIONAL CORP,0.02
  E,4,COMERICA INC,0.02
  E,4,CAMPBELL SOUP CO,0.02
  E,5,MICROSOFT CORP,0.01
  E,5,MCDONALDS CORP,0.01
  E,5,HP INC,0.01
  E,5,HEWLETT PACKA,0.02
  E,5,CLOROX COMPANY,0
  E,5,Xylem Inc/NY,0.02
  E,5,GAP INC/THE,0.02
  E,8,LINDE PLC COMMON STOCK EUR.001,0.01
  E,8,BOOKING HOLDINGS INC,0.01
  E,8,VIACOMCBS INC,0.04
  G,0,BERKSHIRE HATHAWAY INC-CL B,0.06
  G,0,NETFLIX INC,0.06
  G,0,CROWN CASTLE INTL CORP,0.06
  G,1,Facebook Inc.,0.01
  G,1,VERTEX PHARMACEUTICALS INC,0.02
  G,1,ACTIVISION BLIZZARD INC,0.03
  G,1,VERISK ANALYTICS INC,0.01
  G,1,FLEETCOR TECHNOLOGIES INC,0.01
  G,1,COPART INC,0.03
  G,1,Alexandria Real Estate Equitie,0
  G,1,The Cooper Companies Inc.,0.01
  G,1,NUCOR CORP,0.01
  G,1,CINCINNATI FINANCIAL CORP,0.01
  G,2,AMAZON.COM INC,0.02
  G,2,EXXON MOBIL CORP,0.03
  G,2,CHUBB LIMITED,0.01
  G,2,DUKE ENERGY CORP,0.01
  G,2,PHILLIPS 66,0.02
  G,2,PARKER-HANNIFIN CORP COMMON STOCK USD 0.5,0.01
  G,2,ROYAL CARIBBEAN CRUISES LTD,0.01
  G,2,HALLIBURTON CO,0.01
  G,2,FIRST REPUBLIC BANK/CA,0.01
  G,2,DOVER CORP,0.01
  G,2,WATERS CORP,0.01
  G,2,SEAGATE TECHNOLOGY,0.02
  G,2,DENTSPLY SIRONA INC,0.01
  G,2,BROWN-FORMAN CORP,0.02
  G,2,JUNIPER NETWORKS INC,0.02
  G,2,PVH CORP,0.02
  G,3,COCA-COLA CO/THE,0
  G,3,WELLS FARGO & CO,0.02
  G,3,BOEING CO,0.01
  G,3,MCDONALDS CORP,0.01
  G,3,BRISTOL-MYERS SQUIBB CO,0.01
  G,3,3M CO,0.01
  G,3,GILEAD SCIENCES INC,0.01
  G,3,HEWLETT PACKA,0.02
  G,3,METTLER-TOLEDO,0.02
  G,3,KANSAS CITY SOUTHERN,0
  G,3,WW GRAINGER INC,0.01
  G,3,Xylem Inc/NY,0.02
  G,3,DARDEN RESTAURANTS INC,0.02
  G,3,HASBRO INC,0
  G,3,ALLIANT ENERGY CORP,0.02
  G,3,HOST HOTELS & RESORTS INC,0.02
  G,3,LINCOLN NATIONAL CORP,0.02
  G,3,NOBLE ENERGY INC,0.02
  G,3,COMERICA INC,0.02
  G,3,CAMPBELL SOUP CO,0.02
  G,3,TAPESTRY INC COMMON STOCK USD.01,0.02
  G,3,GAP INC/THE,0.02
  G,4,MICROSOFT CORP,0.01
  G,4,CISCO SYSTEMS INC,0
  G,4,UNION PACIFIC CORP,0.01
  G,4,TEXAS INSTRUMENTS INC,0.01
  G,4,HP INC,0.01
  G,4,BEST BUY CO INC,0
  G,4,CLOROX COMPANY,0
  G,8,LINDE PLC COMMON STOCK EUR.001,0.01
  G,8,BOOKING HOLDINGS INC,0.01
  G,8,VIACOMCBS INC,0.04
  S,1,BERKSHIRE HATHAWAY INC-CL B,0.06
  S,1,FLEETCOR TECHNOLOGIES INC,0.01
  S,1,COPART INC,0.03
  S,1,DOVER CORP,0.01
  S,1,The Cooper Companies Inc.,0.01
  S,1,CINCINNATI FINANCIAL CORP,0.01
  S,2,AMAZON.COM INC,0.02
  S,2,Facebook Inc.,0.01
  S,2,EXXON MOBIL CORP,0.03
  S,2,NETFLIX INC,0.06
  S,2,UNION PACIFIC CORP,0.01
  S,2,CROWN CASTLE INTL CORP,0.06
  S,2,ACTIVISION BLIZZARD INC,0.03
  S,2,PARKER-HANNIFIN CORP COMMON STOCK USD 0.5,0.01
  S,2,HALLIBURTON CO,0.01
  S,2,Alexandria Real Estate Equitie,0
  S,2,NUCOR CORP,0.01
  S,2,WATERS CORP,0.01
  S,3,WELLS FARGO & CO,0.02
  S,3,BOEING CO,0.01
  S,3,MCDONALDS CORP,0.01
  S,3,CHUBB LIMITED,0.01
  S,3,DUKE ENERGY CORP,0.01
  S,3,VERTEX PHARMACEUTICALS INC,0.02
  S,3,PHILLIPS 66,0.02
  S,3,VERISK ANALYTICS INC,0.01
  S,3,ROYAL CARIBBEAN CRUISES LTD,0.01
  S,3,HEWLETT PACKA,0.02
  S,3,METTLER-TOLEDO,0.02
  S,3,FIRST REPUBLIC BANK/CA,0.01
  S,3,KANSAS CITY SOUTHERN,0
  S,3,WW GRAINGER INC,0.01
  S,3,Xylem Inc/NY,0.02
  S,3,SEAGATE TECHNOLOGY,0.02
  S,3,ALLIANT ENERGY CORP,0.02
  S,4,COCA-COLA CO/THE,0
  S,4,BRISTOL-MYERS SQUIBB CO,0.01
  S,4,TEXAS INSTRUMENTS INC,0.01
  S,4,3M CO,0.01
  S,4,GILEAD SCIENCES INC,0.01
  S,4,BEST BUY CO INC,0
  S,4,CLOROX COMPANY,0
  S,4,DARDEN RESTAURANTS INC,0.02
  S,5,MICROSOFT CORP,0.01
  S,5,CISCO SYSTEMS INC,0
  S,5,HP INC,0.01
  S,5,HASBRO INC,0
  S,8,LINDE PLC COMMON STOCK EUR.001,0.01
  S,8,BOOKING HOLDINGS INC,0.01
  S,8,VIACOMCBS INC,0.04
  S,8,DENTSPLY SIRONA INC,0.01
  S,8,HOST HOTELS & RESORTS INC,0.02
  S,8,BROWN-FORMAN CORP,0.02
  S,8,LINCOLN NATIONAL CORP,0.02
  S,8,NOBLE ENERGY INC,0.02
  S,8,COMERICA INC,0.02
  S,8,JUNIPER NETWORKS INC,0.02
  S,8,CAMPBELL SOUP CO,0.02
  S,8,TAPESTRY INC COMMON STOCK USD.01,0.02
  S,8,PVH CORP,0.02
  S,8,GAP INC/THE,0.02
  `;
  scale = 1000;
  scl = 0.01;
  root3 = Math.sqrt(3);
  received = 5;
  colourgamma = 1;
  setColour = 'orange';
  constructor(private element: ElementRef) { }
  formatC = (i: number) => d3.format('0.2f')(i);
  ttt = (i: number) => `M${i / 2} 0L${i} ${i / 2 * this.root3}L0 ${i / 2 * this.root3}Z`;
  linePath(data: number[], b = 0) {
    const base = 0;
    let back = `M${this.xl(0)} ${this.yl(base)}L`;
    for (let i = 0; i < data.length; ++i) {
      back += `${this.xl(i / (data.length - 1))} ${this.yl(data[i])}`;
      back += i === data.length - 1 ? `L${this.xl(1)} ${this.yl(base)}Z` : 'L';
    }
    return back;
  }
  ngOnInit() {
    this.colourgamma = +(d3.select('#slide').node() as HTMLInputElement).value / 10000;
    this.picdata1 = this.processData(this.rawData1);
    this.picdata2 = this.processData(this.rawData2);
    this.picdata3 = this.processData(this.rawData3);
    this.picdata4 = this.processData(this.rawData4);
    this.picdata5 = this.processData(this.rawData5);
    setTimeout(() => {
      this.update();
      d3.select(this.element.nativeElement).selectAll('app-dartboard')
        .style('--back', 'rgb(183, 119, 23)');
    });
  }
  processData(rawData: string, sortData = true) {
    const data = [];
    let gac = '';
    let tac = '';
    let sac = '';
    const lines = rawData.split('\n');
    let items: string[];
    lines.forEach((line, i) => {
      line = line.replace(/^,*/, '');
      line = line.replace(/,*$/, '');
      line = line.replace(/^ */, '');
      line = line.replace(/ *$/, '');
      if (i === 0) {
        items = line.split(',');
      } else {
        const obj = {};
        const here = line.split(',');
        if (here.length === items.length) {
          for (let j = 0; j < items.length; ++j) {
            obj[items[j].replace(' ', '')] = here[j];
          }
          data.push(obj);
        }
      }
    });
    /*      data.sort((a, b) => {
            const as = '' + a.sac as string;
            const bs = '' + b.sac as string;
            const at = '' + a.tac as string;
            const bt = '' + b.tac as string;
            const ag = '' + a.gac as string;
            const bg = '' + b.gac as string;
            return (ag + at).localeCompare(bg + bt);
          });*/
    const datas = {
      children: [],
      name: '',
      index: 0,
      size: 0
    };
    let dtac: {
      children: any[];
      name: string;
      index: number;
      size: number;
    }, dsac: {
      children: any[];
      name: string;
      index: number;
      size: number;
    }, dgac: {
      children: any[];
      name: string;
      index: number;
      size: number;
    }, ig = 0, it = 0, is = 0, iii = 1;
    data.forEach(d => {
      if (d.gac !== undefined && gac !== d.gac) {
        datas.children.push({
          children: [],
          name: d.gac,
        });
        dgac = datas.children[ig];
        ig++;
        it = 0;
        is = 0;
      }
      if (d.tac !== undefined && tac !== d.tac) {
        const pushHere = dgac !== undefined ? dgac.children : datas.children;
        pushHere.push({
          children: [],
          name: d.tac,
        });
        dtac = dgac !== undefined ? dgac.children[it] : datas.children[it];
        it++;
        is = 0;
      }
      if (d.sac !== undefined && sac !== d.sac) {
        const pushHere = dtac !== undefined ? dtac.children : dgac !== undefined ? dgac.children : datas.children;
        pushHere.push({
          children: [],
          name: d.sac,
        });
        dsac = dtac !== undefined ? dtac.children[is] : dgac !== undefined ? dgac.children[is] : datas.children[is];
        is++;
      }
      const lastPush = dsac !== undefined ? dsac : dtac !== undefined ? dtac : dgac;
      lastPush.children.push({
        children: [],
        name: d.name,
        size: d.weight,
        index: iii++
      });
      gac = d.gac;
      tac = d.tac;
      sac = d.sac;
    });
    let dSTGdef = 0;
    if (dgac !== undefined) {
      dSTGdef++;
    }
    if (dsac !== undefined) {
      dSTGdef++;
    }
    if (dtac !== undefined) {
      dSTGdef++;
    }
    if (dSTGdef === 3) {
      datas.children.forEach((d) => {
        d.children.forEach(e => {
          e.children.forEach(f => {
            f.index = iii++;
          });
        });
      });
    }
    if (dSTGdef >= 2) {
      datas.children.forEach(d => {
        d.children.forEach(e => {
          e.index = iii++;
        });
      });
    }
    if (dSTGdef >= 1) {
      datas.children.forEach((d) => {
        d.index = iii++;
      });
    }
    console.log(datas);
    const dnew = d3.hierarchy(datas);
    iii = 0;
    dnew.sum(d => { iii++; return +d.size; });
    if (sortData) {
      dnew.sort((a, b) => (a.value - b.value));
    }
    return (d3.partition()(dnew).descendants() as d3.HierarchyRectangularNode<{
      children: any[];
      name: string;
      index: number;
      size: number;
    }>[]);
  }
  newgamma(ev: MouseEvent) {
    this.colourgamma = +(ev.target as HTMLInputElement).value / 10000;
    this.update();
  }
  update() {
    //  d3.select('app-dartboard').style('--back', this.setColour);
    //  d3.select('app-dartboard').attr('smallgreytitle', this.setColour);
  }
  pick3d(ev: MouseEvent) {
    const dim = +d3.select('#picker').attr('width');
    const root = (d3.select('app-root').node() as HTMLElement).getBoundingClientRect();
    const origin = (d3.select(this.element.nativeElement).node() as HTMLElement).getBoundingClientRect();
    const X = ev.pageX - origin.left;
    const Y = ev.pageY - origin.top - root.top;
    const GB = d3.scaleLinear<d3.RGBColor>()
      .domain([0, dim])
      .interpolate(d3.interpolateRgb.gamma(1.0))
      .range([d3.rgb(0, 255, 0), d3.rgb(0, 0, 255)])
      ;
    const RG = d3.scaleLinear<d3.RGBColor>()
      .domain([0, dim / 2])
      .interpolate(d3.interpolateRgb.gamma(1.0))
      .range([d3.rgb(255, 0, 0), d3.rgb(GB(X))])
      ;
    this.setColour = RG(Y / this.root3 * 2);
    this.update();
  }
  clickShape(j: number) {
    const bot = this.L4DATA.length ;
    const i = bot-j;
    this.yl.domain([(i - 1) / bot, i / bot]);
  }
}
