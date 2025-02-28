import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InGateComponent } from './in-gate.component';

describe('CleaningProceduresComponent', () => {
  let component: InGateComponent;
  let fixture: ComponentFixture<InGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InGateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
