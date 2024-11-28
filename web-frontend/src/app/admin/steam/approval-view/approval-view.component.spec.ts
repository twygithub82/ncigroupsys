import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamApprovalViewComponent } from './approval-view.component';

describe('SteamApprovalViewComponent', () => {
  let component: SteamApprovalViewComponent;
  let fixture: ComponentFixture<SteamApprovalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamApprovalViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
