import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateApprovalNewComponent } from './estimate-approval-new.component';

describe('SteamEstimateApprovalNewComponent', () => {
  let component: SteamEstimateApprovalNewComponent;
  let fixture: ComponentFixture<SteamEstimateApprovalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamEstimateApprovalNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamEstimateApprovalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
