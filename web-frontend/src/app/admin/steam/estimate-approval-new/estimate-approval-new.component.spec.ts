import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateNewComponent } from './estimate-new.component';

describe('SteamEstimateNewComponent', () => {
  let component: SteamEstimateNewComponent;
  let fixture: ComponentFixture<SteamEstimateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamEstimateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamEstimateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
