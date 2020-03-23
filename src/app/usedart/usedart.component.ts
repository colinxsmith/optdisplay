import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-usedart',
  templateUrl: './usedart.component.html',
  styleUrls: ['./usedart.component.css']
})
export class UsedartComponent implements OnInit {
  rawData = `gac,tac,name,weight
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
  `
  lines: string[];
  data = [];
  datas: {
    children: any[];
    name: string;
    index: number;
    size: number;
  };
  dnew: d3.HierarchyNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>;
  picdata: d3.HierarchyRectangularNode<{
    children: any[];
    name: string;
    index: number;
    size: number;
  }>[];
  scale = 1000;
  scl = 0.01;
  root3 = Math.sqrt(3);
  received = 5;
  colourgamma = 1;
  setColour = 'orange';
  constructor(private element: ElementRef) { }
  formatC = (i: number) => d3.format('0.2f')(i);
  ttt = (i: number) => `M${i / 2} 0L${i} ${i / 2 * this.root3}L0 ${i / 2 * this.root3}Z`;
  ngOnInit() {
    this.colourgamma = +(d3.select('#slide').node() as HTMLInputElement).value / 10000;
    this.data = [];
    let gac = '';
    let tac = '';
    let sac = '';
    this.lines = this.rawData.split('\n');
    let items: string[];
    this.lines.forEach((line, i) => {
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
          this.data.push(obj);
        }
      }
    });
    this.data.sort((a, b) => {
      const as = '' + a.sac as string;
      const bs = '' + b.sac as string;
      const at = '' + a.tac as string;
      const bt = '' + b.tac as string;
      const ag = '' + a.gac as string;
      const bg = '' + b.gac as string;
      //     return (as + at + ag) === (bs + bt + bg) ? 0 : (as + at + ag) > (bs + bt + bg) ? 1 : -1;
      //  return (as + at + ag).localeCompare(bs + bt + bg);
      return (ag).localeCompare(bg);
    });
    console.log('sorted');
    this.datas = {
      children: [],
      name: 'Total',
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
    this.data.forEach(d => {
      if (d.gac !== undefined && gac !== d.gac) {
        this.datas.children.push({
          children: [],
          name: d.gac,
        });
        dgac = this.datas.children[ig];
        ig++;
        it = 0;
        is = 0;
      }
      if (d.tac !== undefined && tac !== d.tac) {
        const pushHere = dgac !== undefined ? dgac.children : this.datas.children;
        pushHere.push({
          children: [],
          name: d.tac,
        });
        dtac = dgac !== undefined ? dgac.children[it] : this.datas.children[it];
        it++;
        is = 0;
      }
      if (d.sac !== undefined && sac !== d.sac) {
        const pushHere = dtac !== undefined ? dtac.children : dgac !== undefined ? dgac.children : this.datas.children;
        pushHere.push({
          children: [],
          name: d.sac,
        });
        dsac = dtac !== undefined ? dtac.children[is] : dgac !== undefined ? dgac.children[is] : this.datas.children[is];
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
      this.datas.children.forEach((d) => {
        d.children.forEach(e => {
          e.children.forEach(f => {
            f.index = iii++;
          });
        });
      });
    }
    if (dSTGdef >= 2) {
      this.datas.children.forEach(d => {
        d.children.forEach(e => {
          e.index = iii++;
        });
      });
    }
    if (dSTGdef >= 1) {
      this.datas.children.forEach((d) => {
        d.index = iii++;
      });
    }
    console.log(this.datas);
    this.dnew = d3.hierarchy(this.datas);
    iii = 0;
    this.dnew.sum(d => { iii++; return +d.size; });
    this.picdata = (d3.partition()(this.dnew).descendants() as d3.HierarchyRectangularNode<{
      children: any[];
      name: string;
      index: number;
      size: number;
    }>[]);
    setTimeout(() => {
      this.update();
    });
  }
  newgamma(ev: MouseEvent) {
    this.colourgamma = +(ev.target as HTMLInputElement).value / 10000;
    this.update();
  }
  update() {
    d3.select('app-dartboard').style('--back', this.setColour);
    d3.select('app-dartboard').attr('smallgreytitle', this.setColour);
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
}
