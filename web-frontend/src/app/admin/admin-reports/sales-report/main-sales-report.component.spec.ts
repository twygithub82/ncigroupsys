import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSalesReportComponent } from './main-sales-report.component';

describe('MainSalesReportComponent', () => {
  let component: MainSalesReportComponent;
  let fixture: ComponentFixture<MainSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSalesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
