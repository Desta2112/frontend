import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as EthiopianDate from 'ethiopian-date';
@Injectable({
  providedIn: 'root',
})
export class EthiopianDateService {
  convertToEthiopian(gregorianDate: Date): NgbDateStruct {
    if (!(gregorianDate instanceof Date)) {
      gregorianDate = new Date(gregorianDate);
    }

    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();

    const [ethiopianYear, ethiopianMonth, ethiopianDay] = EthiopianDate.toEthiopian([year, month, day]);

    return { year: ethiopianYear, month: ethiopianMonth, day: ethiopianDay };
  }


  convertToGregorian(ethiopianDate: NgbDateStruct): Date {
    const { year, month, day } = ethiopianDate;
    const gregorianDate = EthiopianDate.toGregorian([year, month, day]);
    
    // Explicitly set the time to noon (12:00) to avoid timezone shifts
    return new Date(Date.UTC(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], 12, 0, 0));
  }
  

  
  formatEthiopianDate(ethiopianDate: NgbDateStruct): string {
    return `${ethiopianDate.day.toString().padStart(2, '0')}/${ethiopianDate.month.toString().padStart(2, '0')}/${ethiopianDate.year}`;
  }
}
  // convertToGregorian(ethiopianDate: NgbDateStruct): Date {
  //   const { year, month, day } = ethiopianDate;
  //   const gregorianDate = EthiopianDate.toGregorian([year, month, day]);
  //   return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2]);
  // }