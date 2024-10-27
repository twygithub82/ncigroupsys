import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairApprovalViewComponent } from './approval-view.component';

describe('RepairApprovalViewComponent', () => {
  let component: RepairApprovalViewComponent;
  let fixture: ComponentFixture<RepairApprovalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairApprovalViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
