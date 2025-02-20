import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankActivitiyYardReportComponent } from './yard-report.component';

describe('TankActivitiyYardReportComponent', () => {
  let component: TankActivitiyYardReportComponent;
  let fixture: ComponentFixture<TankActivitiyYardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankActivitiyYardReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankActivitiyYardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
