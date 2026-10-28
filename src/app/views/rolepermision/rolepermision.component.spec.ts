import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolepermisionComponent } from './rolepermision.component';

describe('RolepermisionComponent', () => {
  let component: RolepermisionComponent;
  let fixture: ComponentFixture<RolepermisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolepermisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolepermisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
