import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutGateComponent } from './out-gate.component';

describe('CleaningProceduresComponent', () => {
  let component: OutGateComponent;
  let fixture: ComponentFixture<OutGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutGateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
