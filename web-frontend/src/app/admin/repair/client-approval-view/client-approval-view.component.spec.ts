import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairApprovalClientViewComponent } from './client-approval-view.component';

describe('RepairApprovalClientViewComponent', () => {
  let component: RepairApprovalClientViewComponent;
  let fixture: ComponentFixture<RepairApprovalClientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairApprovalClientViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairApprovalClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
