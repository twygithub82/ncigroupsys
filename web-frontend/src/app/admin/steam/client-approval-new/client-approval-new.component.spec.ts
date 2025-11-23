import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateApprovalClientNewComponent } from './client-approval-new.component';

describe('SteamEstimateApprovalClientNewComponent', () => {
  let component: SteamEstimateApprovalClientNewComponent;
  let fixture: ComponentFixture<SteamEstimateApprovalClientNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamEstimateApprovalClientNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamEstimateApprovalClientNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
