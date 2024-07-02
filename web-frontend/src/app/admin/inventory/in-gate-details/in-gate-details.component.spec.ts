import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InGateDetailsComponent } from './in-gate-details.component';

describe('CleaningProceduresComponent', () => {
  let component: InGateDetailsComponent;
  let fixture: ComponentFixture<InGateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InGateDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InGateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
