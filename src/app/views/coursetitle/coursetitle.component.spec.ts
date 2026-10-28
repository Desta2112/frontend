import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursetitleComponent } from './coursetitle.component';

describe('CoursetitleComponent', () => {
  let component: CoursetitleComponent;
  let fixture: ComponentFixture<CoursetitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursetitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursetitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
