import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YardStatusReportComponent } from './yard-status.component';

describe('YardStatusReportComponent', () => {
  let component: YardStatusReportComponent;
  let fixture: ComponentFixture<YardStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YardStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YardStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
