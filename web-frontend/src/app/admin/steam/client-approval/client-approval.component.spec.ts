import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateApprovalClientComponent } from './client-approval.component';

describe('SteamEstimateApprovalClientComponent', () => {
  let component: SteamEstimateApprovalClientComponent;
  let fixture: ComponentFixture<SteamEstimateApprovalClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamEstimateApprovalClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamEstimateApprovalClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
