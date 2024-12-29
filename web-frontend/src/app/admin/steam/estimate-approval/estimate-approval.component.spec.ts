import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateApprovalComponent } from './estimate-approval.component';

describe('SteamEstimateApprovalComponent', () => {
  let component: SteamEstimateApprovalComponent;
  let fixture: ComponentFixture<SteamEstimateApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamEstimateApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamEstimateApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
