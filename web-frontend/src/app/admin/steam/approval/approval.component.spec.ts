import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamApprovalComponent } from './approval.component';

describe('SteamApprovalComponent', () => {
  let component: SteamApprovalComponent;
  let fixture: ComponentFixture<SteamApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
