import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairApprovalClientComponent } from './client-approval.component';

describe('RepairApprovalClientComponent', () => {
  let component: RepairApprovalClientComponent;
  let fixture: ComponentFixture<RepairApprovalClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairApprovalClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairApprovalClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
