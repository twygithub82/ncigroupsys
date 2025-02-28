import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InGateMainComponent } from './in-gate-main.component';

describe('InGateMainComponent', () => {
  let component: InGateMainComponent;
  let fixture: ComponentFixture<InGateMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InGateMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InGateMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
