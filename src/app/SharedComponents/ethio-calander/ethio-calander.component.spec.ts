import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdDatepickerEthiopian } from './ethio-calander.component';

describe('EthioCalanderComponent', () => {
  let component: NgbdDatepickerEthiopian;
  let fixture: ComponentFixture<NgbdDatepickerEthiopian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbdDatepickerEthiopian],
    }).compileComponents();

    fixture = TestBed.createComponent(NgbdDatepickerEthiopian);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
