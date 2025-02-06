import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationStatusReportComponent } from './location-status.component';

describe('LocationStatusReportComponent', () => {
  let component: LocationStatusReportComponent;
  let fixture: ComponentFixture<LocationStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
