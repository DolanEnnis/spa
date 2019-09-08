import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  public incidental: number = 8.37;
  public travel: number = 114.46;


  constructor() { }

  pilotCharge(gt: number, port: string) {
    // Pilot Rates
    console.log("looking up rates for: " + port)
    const cappa = 83.53;
    const mpMin = 379.10;
    const mprate = 0.0491;
    let charge: number;
    switch (port) {
      case 'Anchorage':
        charge = 0;
        break;
      case 'Cappa':
        charge = cappa;
        break;
      case 'Moneypoint':
        charge = mprate * gt;
        if (charge < mpMin) { charge = mpMin }
        break;
      case 'Tarbert':
        if (gt > 20000) {
          charge = 1648.97 + (0.0727 * (gt - 20000))
        }
        else {
          charge = 0.0567 * gt;
          if (charge < mpMin) { charge = mpMin }
        }
        break;
      case 'Foynes':
        charge = this.foynesCharge(gt)
        break;
      case 'Aughinish':
        charge = this.aughCharge(gt)
        break;
      case 'Shannon':
        if (gt > 2000) {
          charge = mpMin + (0.084 * (gt - 2000))
        }
        else {
          charge = mpMin
        }
        break;
      case 'Limerick':
        if (gt > 2000) {
          charge = 334.54 + (0.094 * (gt - 2000))
        }
        else {
          charge = 334.54
        }
        break;
    }
    return this.roundTo(charge);
  }
  /*  'Moneypoint' | 'Tarbert' | 'Foynes' | 'Aughinish' | 'Shannon' | 'Limerick' */

  foynesCharge(gt: number) {
    let charge: number;
    if (gt > 40000) {
      charge = 10000273.27
    }
    else if (gt > 30000) {
      charge = 559.29 + this.travel
    }
    else if (gt > 20000) {
      charge = 555.38 + this.travel
    }
    else if (gt > 15000) {
      charge = 411.90 + this.travel
    }
    else if (gt > 10000) {
      charge = 323.52 + this.travel
    }
    else if (gt > 5000) {
      charge = 314.82 + this.travel
    }
    else {
      charge = 238.84 + this.travel
    }
    return charge
  }

  aughCharge(gt: number) {
    let charge: number;
    const minAugh: number = 379.10
    if (gt > 20000) {
      charge = 1884.95 + (0.0375 * (gt - 20000))
    }
    else if (gt > 12000) {
      charge = (minAugh + (10000 * 0.073)) + ((gt - 12000) * 0.0289)
    }
    else if (gt > 2000) {
      charge = (minAugh + ((gt - 2000) * 0.073))
    }
    else {
      charge = minAugh
    }
    return charge
  }

  berthing(gt: number, port: string) {
    let berthing: number;
    if (port == "Anchorage") {
      if (gt > 85000) {
        berthing = 273.27
      }
      else if (gt > 65000) {
        berthing = 248.62
      }
      else if (gt > 50000) {
        berthing = 227.91
      }
      else if (gt > 35000) {
        berthing = 207.18
      }
      else if (gt > 25000) {
        berthing = 186.46
      }
      else if (gt > 16000) {
        berthing = 165.74
      }
      else if (gt > 8000) {
        berthing = 145.07
      }
      else {
        berthing = 82.86
      }
    }
    else {
      if (gt > 100000) {
        berthing = 269.71
      }
      else if (gt > 70000) {
        berthing = 248.62
      }
      else if (gt > 60000) {
        berthing = 198.89
      }
      else if (gt > 50000) {
        berthing = 151.23
      }
      else if (gt > 30000) {
        berthing = 122.23
      }
      else if (gt > 15000) {
        berthing = 87.01
      }
      else if (gt > 5000) {
        berthing = 58
      }
      else if (gt > 1500 || port == 'Foynes') {
        berthing = 38.33
      }
      else {
        berthing = 29
      }
    }
    return berthing
  }

  // From Stackoverflow https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places/22977058
  roundTo(n) {
    const digits = 2
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    var test = (Math.round(n) / multiplicator);
    return +(test.toFixed(digits));
  }
}
