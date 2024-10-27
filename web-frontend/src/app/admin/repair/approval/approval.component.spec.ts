import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairApprovalComponent } from './approval.component';

describe('RepairApprovalComponent', () => {
  let component: RepairApprovalComponent;
  let fixture: ComponentFixture<RepairApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
