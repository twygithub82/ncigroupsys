import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankActivitiyCleaningReportComponent } from './cleaning-activity.component';

describe('TankActivitiyCleaningReportComponent', () => {
  let component: TankActivitiyCleaningReportComponent;
  let fixture: ComponentFixture<TankActivitiyCleaningReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankActivitiyCleaningReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankActivitiyCleaningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
