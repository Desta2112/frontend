// import { Injectable } from '@angular/core';
// //import * as ethiopianDate from 'ethiopian-date';

// @Injectable({
//   providedIn: 'root',
// })
// export class DateConverterService {
//   // Convert Gregorian to Ethiopian
//   toEthiopian(gregorianDate: string): string {
//     if (!gregorianDate) return '';
//     const [year, month, day] = gregorianDate.split('-').map(Number);
//     const [ethYear, ethMonth, ethDay] = ethiopianDate.toEthiopian(year, month, day);
//     return `${ethYear}-${this.pad(ethMonth)}-${this.pad(ethDay)}`;
//   }

//   // Convert Ethiopian back to Gregorian
//   toGregorian(ethiopianDateStr: string): string {
//     if (!ethiopianDateStr) return '';
//     const [year, month, day] = ethiopianDateStr.split('-').map(Number);
//     const [grYear, grMonth, grDay] = ethiopianDate.toGregorian(year, month, day);
//     return `${grYear}-${this.pad(grMonth)}-${this.pad(grDay)}`;
//   }

//   private pad(value: number): string {
//     return value < 10 ? `0${value}` : `${value}`;
//   }
}
