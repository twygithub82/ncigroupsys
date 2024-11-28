import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamEstimateComponent } from './estimate.component';

describe('SteamEstimateComponent', () => {
  let component: SteamEstimateComponent;
  let fixture: ComponentFixture<SteamEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamEstimateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
