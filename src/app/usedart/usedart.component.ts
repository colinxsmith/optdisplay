import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-usedart',
  templateUrl: './usedart.component.html',
  styleUrls: ['./usedart.component.css']
})
export class UsedartComponent implements OnInit {
  rawData = `name,Holders,tac,sac,gac
  a,1,h1,h2,g1
  b,2,h1,h4,g1
  c,3,h1,h4,g1
  d,4,h1,h2,g1
  e,5,bbbb,ddd,g1
  f,6,cccc,ddd,g1
  g,7,cccc,eee,g1
  h,8,cccc,ddd,g1
  i,9,dddd,fff,g1
  az,1,h1z,h2z,g2
  bz,2,h1z,h4z,g2
  cz,3,h1z,h4z,g2
  dz,4,h1z,h2z,g2
  ez,5,bbbbz,dddz,g2
  fz,6,ccccz,dddz,g2
  gz,7,ccccz,eeez,g2
  hz,8,ccccz,dddz,g2
  iz,9,ddddz,fffz,g2
  `;
  rawData1 = `asset,name,tac,sac,tac code,sac code,accountValue,Holders
B7F9S95,UNITED KINGDOM(GOVERNMENT OF) 1% SNR NTS 07/09/2017 GBP100,Fixed Income,Conventional Gilts,0000000001T,0000000001S,32046.08,1
B16NNR7,UNITED KINGDOM(GOVERNMENT OF) 4.25% STK 07/12/2027 GBP100,Fixed Income,Conventional Gilts,0000000001T,0000000001S,24217.97,1
B1YBRM6,M&G SECURITIES LIMITED CORPORATE BOND I GBP INC,Fixed Income,Corporate Bonds,0000000001T,0000000005S,147204.29,1
B3K7SR4,HSBC GLOBAL ASSET MANAGEMENT UK HSBC CORPORATE BOND INSTL DIS NAV,Fixed Income,Corporate Bonds,0000000001T,0000000005S,99607.07,1
B8N4509,INVESCO FUND MANAGERS IP CORPORATE BOND Z INC,Fixed Income,Corporate Bonds,0000000001T,0000000005S,75283.46,2
B44MQ01,ALLIANCE TRUST ASSET MANAGEMENT LTD MONTHLY INCOME BOND B GROSS INC,Fixed Income,Corporate Bonds,0000000001T,0000000005S,12088.88,1
B5WB663,AXA FUND MANAGERS STERLING CREDIT SHORT DUR BOND Z NET INC,Fixed Income,Corporate Bonds,0000000001T,0000000005S,12069.63,1
B57GX40,MAITLAND INSTITUTIONAL SERVICES LTD MI TWENTYFOUR AM DYNAMIC BD I GR SHS INC,Fixed Income,Global / Strategic,0000000001T,0000000006S,223563.45,13
B3CGHN8,AVIVA INVESTORS UK SVCS LTD STRATEGIC BOND 2 NAV,Fixed Income,Global / Strategic,0000000001T,0000000006S,189219.6,12
BQ13NH7,HSBC INVESTMENT FUNDS LUXEMBOURG SA GLOBAL CORPORATE BOND ZH D GBP,Fixed Income,Global / Strategic,0000000001T,0000000006S,156040.82,1
B65Z3G8,LEGG MASON INVESTMENT FUNDS LTD IF WESTN AST GBL MULTI STRAT BD I INC,Fixed Income,Global / Strategic,0000000001T,0000000006S,107652.18,8
B11DP09,SCHRODER UNIT TRUSTS STRATEGIC CREDIT L DIS,Fixed Income,Global / Strategic,0000000001T,0000000006S,77640.68,4
BF0D2F2,NATIXIS ILN 17/03/23(BSKTS OF INDEXS)GBP1,Fixed Income,Global / Strategic,0000000001T,0000000006S,70405.3,1
B58SJV4,INVESTEC FUND MANAGERS INVESTEC EMG MKTS LOC CUR DEBT I2 INC,Fixed Income,Global / Strategic,0000000001T,0000000006S,66411.68,4
B88K438,BNY MELLON FUND MANAGERS LIMITED NEWTON INTL BOND W NET INSTL INC NAV,Fixed Income,Global / Strategic,0000000001T,0000000006S,8442.06,1
B03MM40,ROYAL DUTCH SHELL 'B'ORD EUR0.07,UK Equity,Oil & Gas Producers,0000000002T,0000000007S,110603.6,6
BZ4BQC7,JOHNSON MATTHEY ORD GBP1.109245,UK Equity,Chemicals,0000000002T,0000000009S,83589.66,5
BWSW5C8,SOUTH32 LTD NPV (DI),UK Equity,Industrial Metals,0000000002T,0000000011S,2780,3
B1XZS82,ANGLO AMERICAN USD0.54945,UK Equity,Mining,0000000002T,0000000012S,28545.13,4
BNGY4Y8,EPWIN GROUP PLC GBP0.0005,UK Equity,Construction & Materials,0000000002T,0000000013S,17092.63,1
B5NR1S7,RESTORE GBP GBP0.05,UK Equity,Support Services,0000000002T,0000000020S,133924.87,5
BVFCZV3,RWS HOLDINGS PLC ORD GBP0.01,UK Equity,Support Services,0000000002T,0000000020S,27212.5,1
B10RZP7,UNILEVER PLC ORD GBP0.031111,UK Equity,Personal Goods,0000000002T,0000000026S,137868.75,6
BD3VFW7,CONVATEC GROUP PLC ORD GBP0.1,UK Equity,Healthcare Equipment & Services,0000000002T,0000000028S,85283.5,5
B2QKY05,SHIRE ORD GBP0.05,UK Equity,Pharmaceuticals & Biotechnology,0000000002T,0000000029S,66215.55,5
B89J241,CLINIGEN GROUP PLC ORD GBP0.001,UK Equity,Pharmaceuticals & Biotechnology,0000000002T,0000000029S,34761.5,1
B8KF9B4,WPP PLC ORD GBP0.10,UK Equity,Media,0000000002T,0000000032S,71780,6
BVDPPV4,REVOLUTION BARS GROUP PLC ORD GBP0.001,UK Equity,Travel & Leisure,0000000002T,0000000033S,54757.5,6
B15FWH7,CINEWORLD GROUP ORD GBP0.01,UK Equity,Travel & Leisure,0000000002T,0000000033S,46751.1,5
BH4HKS3,VODAFONE GROUP ORD USD0.2095238,UK Equity,Mobile Telecommunications,0000000002T,0000000035S,86765.1,5
B4L8497,BURFORD CAPITAL LTD ORD NPV,UK Equity,Financial Services,0000000002T,0000000043S,11364,1
B65TLW2,DIVERSE INCOME TRUST PLC(THE) ORD GBP0.001,UK Equity,Equity Investment Instruments,0000000002T,0000000044S,142211.33,5
B0BDCB2,STRATEGIC EQUITY CAPITAL ORD GBP0.10,UK Equity,Equity Investment Instruments,0000000002T,0000000044S,131919.03,7
BYRH498,GRESHAM HOUSE STRATEGIC PLC ORD GBP0.5,UK Equity,Equity Investment Instruments,0000000002T,0000000044S,17806.25,2
B61D1Y0,EMIS GROUP PLC ORD GBP0.01,UK Equity,Software & Computer Services,0000000002T,0000000046S,21885.63,3
B3FJQ59,JPMORGAN ASSET MANAGEMENT UK LTD US EQUITY INCOME C INC NAV,International Equity,North America ,0000000003T,0000000048S,227205.74,12
BZ2JHF3,HSBC INVESTMENT FUNDS LUXEMBOURG SA ECONOMIC SCALE IDX US EQTY I DIS,International Equity,North America ,0000000003T,0000000048S,139609.88,1
B5KQNG9,HSBC ETFS PLC S&P 500 UCITS ETF,International Equity,North America ,0000000003T,0000000048S,132997.62,1
B241FG3,LEGG MASON GLOBAL FUNDS CLEARBRIDGE US AGGSV GTH PREM A GBP INC,International Equity,North America ,0000000003T,0000000048S,43530.97,2
BKZGVH6,JPMORGAN AMERICAN INVESTMENT TRUST ORD GBP0.05,International Equity,North America ,0000000003T,0000000048S,30776,2
BMMV5G5,ARTEMIS FUND MANAGERS US EXTENDED ALPHA I ACC NAV,International Equity,North America ,0000000003T,0000000048S,27399.81,3
B7M4CS0,SCHRODER UNIT TRUSTS US MID CAP Z INC,International Equity,North America ,0000000003T,0000000048S,12609.92,1
B7LDLV4,SCHRODER UNIT TRUSTS US MID CAP Z ACC,International Equity,North America ,0000000003T,0000000048S,8172.59,1
B3Y7MQ7,BLACKROCK FUND MANAGERS LTD CONTINENTAL EUROPEAN INCOME D UNITS INC,International Equity,Europe (excluding UK)  ,0000000003T,0000000049S,409452.28,14
B7NB1W7,BARING FUND MANAGERS EUROPE SELECT TRUST I INC,International Equity,Europe (excluding UK)  ,0000000003T,0000000049S,151738.69,4
B80QGD8,HSBC GLOBAL ASSET MANAGEMENT UK EUROPEAN INDEX C INC NAV,International Equity,Europe (excluding UK)  ,0000000003T,0000000049S,24789.91,2
BJ04G39,INVESCO FUND MANAGERS IP EUROPEAN EQUITY INCOME Y INC,International Equity,Europe (excluding UK)  ,0000000003T,0000000049S,20291.95,2
BJ04J30,INVESCO FUND MANAGERS IP JAPAN Y ACC,International Equity,Japan,0000000003T,0000000050S,164893.72,6
B5VX756,HSBC ETFS PLC MSCI JAPAN UCITS ETF,International Equity,Japan,0000000003T,0000000050S,91431.68,1
B7XYN97,ISHARES V PLC MSCI JAPAN GBP HEDGED UCITS ETF ACC,International Equity,Japan,0000000003T,0000000050S,10079.73,2
BJGZZ06,BLACKROCK FUND MANAGERS LTD ASIA SPECIAL SITUATIONS D ACC,International Equity,Asia Pacific,0000000003T,0000000051S,226043.19,13
B57S0V2,FIRST STATE INVESTMENTS(UK) STEWART INV ASIA PAC LDRS B GBP DIS,International Equity,Asia Pacific,0000000003T,0000000051S,210250.87,12
B52QVQ3,SCHRODER UNIT TRUSTS ASIAN INCOME MAXIMISER Z DIS,International Equity,Asia Pacific,0000000003T,0000000051S,23809.04,2
B99B9F4,GOLDMAN SACHS FUNDS SICAV INDIA EQUITY PTF R GBP,International Equity,Emerging Markets,0000000003T,0000000052S,114966.74,7
B3SXM83,BLACKROCK FRONTIER MKTS INV TST PLC USD0.01,International Equity,Emerging Markets,0000000003T,0000000052S,64593.05,4
B5ZZY91,JPMORGAN GBL EMERG MKTS INC TST PLC ORD GBP0.01,International Equity,Emerging Markets,0000000003T,0000000052S,43735.11,4
B0DQY35,UTILICO EMERGING MARKETS LTD ORD GBP0.10,International Equity,Emerging Markets,0000000003T,0000000052S,40832.59,3
B3DJ5K9,HERMES INVESTMENT MANAGEMENT GLOBAL EMERGING MARKETS F ACC NAV,International Equity,Emerging Markets,0000000003T,0000000052S,18176.95,1
B8JYV94,JUPITER UNIT TRUST MANAGERS FINANCIAL OPPORTUNITIES I INC,International Equity,Global,0000000003T,0000000053S,23725.02,3
B5N9956,ARTEMIS FUND MANAGERS GLOBAL INCOME UNITS INSTL INC,International Equity,Global,0000000003T,0000000053S,9608.86,1
B8DLY47,NEPTUNE INVESTMENT MANAGEMENT GLOBAL EQUITY C ACC NAV,International Equity,Global,0000000003T,0000000053S,9284,1
BNGY2T9,SMITH & WILLIAMSON FUND ADMIN LTD CHURCH HUS TENAX ABST RTN STRT B INC,Alternatives,Hedge Funds / Absolute Return,0000000005T,0000000054S,185373.11,8
B5KKCX1,HENDERSON INVESTMENT FUNDS LTD UK ABSOLUTE RETURN I ACC NAV,Alternatives,Hedge Funds / Absolute Return,0000000005T,0000000054S,104424.98,2
BYR8GK6,3I INFRASTRUCTURE ORD NPV,Alternatives,Infrastructure & Renewable Energy,0000000005T,0000000056S,228160.18,11
B24HK55,FIRST STATE INVESTMENTS(UK) GLOBAL LISTED INFRASTRUCTURE B GBP INC,Alternatives,Infrastructure & Renewable Energy,0000000005T,0000000056S,83512.94,5
B0T4LH6,HICL INFRASTRUCTURE CO LTD ORD GBP0.0001,Alternatives,Infrastructure & Renewable Energy,0000000005T,0000000056S,22761.82,3
B188SR5,INTERNATIONAL PUBLIC PARTNERSHIP ORD GBP0.0001,Alternatives,Infrastructure & Renewable Energy,0000000005T,0000000056S,10513.8,1
BRK8XJ2,SG ISSUER 0% IDX/LKD GTD NTS 16/10/20 GBP1'62696EN,Alternatives,Alternative Structured Investments,0000000005T,0000000057S,36898.02,1
B57H4F1,LIONTRUST FUND PARTNERS LLP SPECIAL SITUATIONS INC INSTIT,UK Equity,Funds,0000000002T,0000000058S,106125.41,9
B3W2HM5,SCHRODER UNIT TRUSTS RECOVERY Z INC,UK Equity,Funds,0000000002T,0000000058S,88390.22,7
BLRZQ62,CAPITA FINANCIAL MANAGERS WOODFORD EQUITY INCOME C STERLING INC,UK Equity,Funds,0000000002T,0000000058S,40963.07,3
B00Z1R8,UNICORN ASSET MANAGEMENT UK INCOME FUND INSTL INC SHS B NAV,UK Equity,Funds,0000000002T,0000000058S,23879.81,4
B7MPWT4,FRANKLIN TEMPLETON INVESTMENT MGMT UK MANAGERS FOCUS W ACC NAV,UK Equity,Funds,0000000002T,0000000058S,23361.74,2
BP85595,MAITLAND INSTITUTIONAL SERVICES LTD MI CHELVERTON UK EQUITY GROWTH B SHS DIS,UK Equity,Funds,0000000002T,0000000058S,11237.49,1
BD81XT5,POLAR CAPITAL FUNDS UK VALUE OPPORTUNITIES S GBP DIS,UK Equity,Funds,0000000002T,0000000058S,7801.07,1
B1TXLS1,ISHARES II PLC UK PROPERTY UCITS ETF GBP DIST,Property,Property Funds,0000000004T,0000000061S,46994.21,2
B5L01S8,HSBC ETFS PLC FTSE EPRA/NAREIT DEV PROPERTY UCITS GBP,Property,Property Funds,0000000004T,0000000061S,41883.45,3
B702WG4,HSBC GLOBAL ASSET MANAGEMENT UK GLOBAL PROPERTY INC C OPEN FUNDS,Property,Property Funds,0000000004T,0000000061S,21921.32,2
BQ3G0Z1,THREADNEEDLE INVESTMENT SVCS LTD UK PROPERTY AT TRUST INST GBP INCOME,Property,Property Funds,0000000004T,0000000061S,19418.84,2
B842HT5,M&G SECURITIES LIMITED FEEDER OF PROPERTY PTF I INC,Property,Property Funds,0000000004T,0000000061S,3890.29,2
B7RBQM8,AVIVA INVESTORS UK SVCS LTD PROPERTY TRUST 2 INC NAV,Property,Property Funds,0000000004T,0000000061S,3236.09,1
BTLX1Q3,ABERDEEN FUND MANAGERS LTD UK PROPERTY FEEDER UNIT TRUST I INC,Property,Property Funds,0000000004T,0000000061S,144.26,1
B95CGW7,TARGET HEALTHCARE REIT LTD NPV,Property,Property Investment,0000000004T,0000000062S,67457.75,7
BMP3SC5,M&G SECURITIES LIMITED GLOBAL FLTG RATE HIGH YIELD GBP I-H ACC,Fixed Income,High Yield,0000000001T,0000000064S,92345.34,6
B7SGDT8,THREADNEEDLE INVESTMENTS FUNDS HIGH YIELD BOND Z GBP INCOME,Fixed Income,High Yield,0000000001T,0000000064S,39220.04,2
B54L8Q5,GAM STAR FUND CREDIT OPPORTUNITIES GBP INSTL GBP INC,Fixed Income,Fixed Interest Structured Investments,0000000001T,0000000065S,124434.39,9
BFLR220,GEMINI INVESTMENT FUNDS PLC AHFM DEFINED RETURNS B ACC NAV,International Equity,Global Equity Structured Investments,0000000003T,0000000067S,169951.33,13
BZ1JWG0,UBS AG LONDON 0% ELN SNR NTS 02/12/2021 GBP1'14480/15',International Equity,Global Equity Structured Investments,0000000003T,0000000067S,57750,1
BYQRC84,HSBC BANK 0% ELN NTS 13/07/2021 GBP1 '481',International Equity,Global Equity Structured Investments,0000000003T,0000000067S,36105,1
BYXDH80,JP MORGAN STRUCTURED PRODUCTS B.V. 0% NTS 16/12/21 GBP1,International Equity,Global Equity Structured Investments,0000000003T,0000000067S,32437.5,1
BJ04FJ8,INVESCO FUND MANAGERS PERPETUAL DISTRIBUTION Y INC NAV,Mixed Investment,Mixed Investment Funds,0000000007T,0000000069S,96765.26,8
B6TK3R0,ARTEMIS FUND MANAGERS MONTHLY DISTRIBUTION I INC,Mixed Investment,Mixed Investment Funds,0000000007T,0000000069S,7889.68,1
9342231,#N/A,#N/A,#N/A,#N/A,#N/A,361833.94,21
906409,#N/A,#N/A,#N/A,#N/A,#N/A,263451.88,14
245867,#N/A,#N/A,#N/A,#N/A,#N/A,189302.64,1
3337749,#N/A,#N/A,#N/A,#N/A,#N/A,128128.73,8
338530,#N/A,#N/A,#N/A,#N/A,#N/A,112878.6,7
3353790,#N/A,#N/A,#N/A,#N/A,#N/A,108589.57,9
925288,#N/A,#N/A,#N/A,#N/A,#N/A,107987.45,6
526885,#N/A,#N/A,#N/A,#N/A,#N/A,88233.25,1
53673,#N/A,#N/A,#N/A,#N/A,#N/A,86082.75,6
BDR05C0,#N/A,#N/A,#N/A,#N/A,#N/A,81501.67,6
3064650,#N/A,#N/A,#N/A,#N/A,#N/A,71085.46,5
709954,#N/A,#N/A,#N/A,#N/A,#N/A,67465.46,5
3387454,#N/A,#N/A,#N/A,#N/A,#N/A,66765.46,2
667438,#N/A,#N/A,#N/A,#N/A,#N/A,60395,3
339072,#N/A,#N/A,#N/A,#N/A,#N/A,49875,3
237400,#N/A,#N/A,#N/A,#N/A,#N/A,47579.75,2
719737,#N/A,#N/A,#N/A,#N/A,#N/A,44936.82,5
604877,#N/A,#N/A,#N/A,#N/A,#N/A,41239.01,2
56650,#N/A,#N/A,#N/A,#N/A,#N/A,36897.76,5
216238,#N/A,#N/A,#N/A,#N/A,#N/A,33000,1
798059,#N/A,#N/A,#N/A,#N/A,#N/A,32106.37,4
750208,#N/A,#N/A,#N/A,#N/A,#N/A,30058.02,2
10076,#N/A,#N/A,#N/A,#N/A,#N/A,28626.08,2
870612,#N/A,#N/A,#N/A,#N/A,#N/A,27187.65,1
3091357,#N/A,#N/A,#N/A,#N/A,#N/A,22650,5
3128,#N/A,#N/A,#N/A,#N/A,#N/A,20864.61,3
946580,#N/A,#N/A,#N/A,#N/A,#N/A,16516.3,3
408284,#N/A,#N/A,#N/A,#N/A,#N/A,12933.86,2
`;
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
    let htop = '';
    let tac = '';
    let sac = '';
    this.lines = this.rawData.split('\n');
    let items: string[];
    this.lines.forEach((line, i) => {
      line = line.replace(/^,*/, '');
      line = line.replace(/,*$/, '');
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
      const as = a.sac as string;
      const bs = b.sac as string;
      const at = a.tac as string;
      const bt = b.tac as string;
      const ag = a.gac as string;
      const bg = b.gac as string;
      if (as === bs && at === bt && ag === bg) {
        return 0;
      } else if (at === bt && ag === bg) {
        return as < bs ? 1 : -1;
      } else if (as === bs && ag === bg) {
        return at < bt ? 1 : -1;
      } else if (as === bs && at === bt) {
        return ag < bg ? 1 : -1;
      } else if (as === bs) {
        if (at < bt && ag < bg) { return 1; } else if (at > bt && ag > bg) { return 1; } else { return -1; }
      } else if (at === bt) {
        if (as < bs && ag < bg) { return 1; } else if (as > bs && ag > bg) { return 1; } else { return -1; }
      } else if (ag === bg) {
        if (as < bs && at < bt) { return 1; } else if (as > bs && as > bs) { return -1; } else { return -1; }
      }
    });
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
      if (htop !== d.gac) {
        this.datas.children.push({
          children: [],
          name: d.gac,
        });
        dgac = this.datas.children[ig];
        ig++;
        it = 0;
      }
      if (tac !== d.tac) {
        dgac.children.push({
          children: [],
          name: d.tac,
        });
        dtac = dgac.children[it];
        it++;
        is = 0;
      }
      if (sac !== d.sac) {
        dtac.children.push({
          children: [],
          name: d.sac,
        });
        dsac = dtac.children[is];
        is++;
      }
      dsac.children.push({
        children: [],
        name: d.name,
        size: d.Holders,
        index: iii++
      });
      htop = d.gac;
      tac = d.tac;
      sac = d.sac;
    });
    this.datas.children.forEach((d) => {
      d.children.forEach(e => {
        e.children.forEach(f => {
          f.index = iii++;
        });
      });
    });
    this.datas.children.forEach(d => {
      d.children.forEach(e => {
        e.index = iii++;
      });
    });
    this.datas.children.forEach((d) => {
      d.index = iii++;
    });
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
