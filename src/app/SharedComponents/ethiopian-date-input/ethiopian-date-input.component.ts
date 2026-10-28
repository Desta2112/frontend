// import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
// import { NgbCalendar, NgbCalendarEthiopian, NgbDatepickerI18n, NgbDatepickerI18nAmharic, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { EthiopianDateService } from '../ethiopian-date.service';

// @Component({
//   selector: 'app-ethiopian-date-input',
//   standalone: true,
//   encapsulation: ViewEncapsulation.None,
//   styles: `
//     ngbd-datepicker-ethiopian .ngb-dp-weekday {
//       font-size: x-small;
//       overflow: hidden;
//     }
//   `,
//   providers: [
//     { provide: NgbCalendar, useClass: NgbCalendarEthiopian },
//     { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nAmharic },
//   ],
//   imports: [
//     NgbDatepickerModule, 
//     FormsModule,
//     CommonModule
//   ],
//   template: `
//    <div class="form-group position-relative">
//       <label>{{ label }}<span class="text-danger">*</span></label>
//       <div class="input-group">
//         <input
//           type="text"
//           class="form-control"
//           [value]="getEthiopianDate()"
//           readonly
//           (click)="toggleCalendar($event)"
//         />
//         <span class="input-group-text" (click)="toggleCalendar($event)" style="cursor: pointer;">
//           <i class="bi bi-calendar"></i>
//         </span>
//       </div>

//       <!-- Calendar Modal -->
//       <div *ngIf="isCalendarOpen" class="position-absolute z-index-100 mt-2">
//         <ngb-datepicker
//           [(ngModel)]="model"
//           (ngModelChange)="onDateChange()"
//           [firstDayOfWeek]="7"
//           class="form-control"
//         ></ngb-datepicker>
//       </div>
//     </div>
//   `
// })
// export class EthiopianDateInputComponent {
//   @Input() label: string = 'Date';
//   @Input() initialDate: Date = new Date(); // Accept Date
//   @Output() dateChanged = new EventEmitter<Date>(); // Emits Date

//   model: NgbDateStruct;
//   isCalendarOpen: boolean = false;

//   constructor(private ethiopianDateService: EthiopianDateService) {
//     this.model = this.ethiopianDateService.convertToEthiopian(this.initialDate);
//   }

//   toggleCalendar(event: MouseEvent): void {
//     event.stopPropagation();
//     this.isCalendarOpen = !this.isCalendarOpen;
//   }

//   onDateChange(): void {
//     const gregorianDate = this.ethiopianDateService.convertToGregorian(this.model);
//     this.dateChanged.emit(gregorianDate); // emit Date object
//     this.isCalendarOpen = false;
//   }

//   getEthiopianDate(): string {
//     return this.ethiopianDateService.formatEthiopianDate(this.model);
//   }
// }
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbCalendarEthiopian, NgbDatepickerI18n, NgbDatepickerI18nAmharic, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EthiopianDateService } from '../ethiopian-date.service';

@Component({
  selector: 'app-ethiopian-date-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: `
    ngbd-datepicker-ethiopian .ngb-dp-weekday {
      font-size: x-small;
      overflow: hidden;
    }
  `,
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarEthiopian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nAmharic },
  ],
  imports: [
    NgbDatepickerModule, 
    FormsModule,
    CommonModule
  ],
  template: `
   <div class="form-group position-relative">
      <label>{{ label }}</label>
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          [value]="getEthiopianDate()"
          readonly
          (click)="toggleCalendar($event)"
        />
        <span class="input-group-text" (click)="toggleCalendar($event)" style="cursor: pointer;">
          <i class="bi bi-calendar"></i>
        </span>
      </div>

      <!-- Calendar Modal -->
      <div *ngIf="isCalendarOpen" class="position-absolute z-index-100 mt-2">
        <ngb-datepicker
          [(ngModel)]="model"
          (ngModelChange)="onDateChange()"
          [firstDayOfWeek]="7"
          class="form-control"
        ></ngb-datepicker>
      </div>
    </div>
  `
})
export class EthiopianDateInputComponent {
  @Input() label: string = '';

  private _initialDate: Date = new Date();
  @Input()
  set initialDate(value: Date | null) {
    this._initialDate = value ?? new Date(); // fallback to today if null
    this.model = this.ethiopianDateService.convertToEthiopian(this._initialDate);
  }
  get initialDate(): Date {
    return this._initialDate;
  }

  @Output() dateChanged = new EventEmitter<Date>();

  model: NgbDateStruct;
  isCalendarOpen: boolean = false;

  constructor(private ethiopianDateService: EthiopianDateService) {
    this.model = this.ethiopianDateService.convertToEthiopian(this._initialDate);
  }

  toggleCalendar(event: MouseEvent): void {
    event.stopPropagation();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  onDateChange(): void {
    const gregorianDate = this.ethiopianDateService.convertToGregorian(this.model);
    this.dateChanged.emit(gregorianDate);
    this.isCalendarOpen = false;
  }

  getEthiopianDate(): string {
    return this.ethiopianDateService.formatEthiopianDate(this.model);
  }
}


