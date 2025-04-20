import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainManagementReportOrderTrackComponent } from './main-order-track.component';

describe('MainOrderTrackComponent', () => {
  let component: MainManagementReportOrderTrackComponent;
  let fixture: ComponentFixture<MainManagementReportOrderTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainManagementReportOrderTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainManagementReportOrderTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
