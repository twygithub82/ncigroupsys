import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTransferReportComponent } from './location-transfer.component';

describe('LocationTransferReportComponent', () => {
  let component: LocationTransferReportComponent;
  let fixture: ComponentFixture<LocationTransferReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationTransferReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
