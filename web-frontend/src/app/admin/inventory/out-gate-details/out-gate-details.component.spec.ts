import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutGateDetailsComponent } from './out-gate-details.component';

describe('CleaningProceduresComponent', () => {
  let component: OutGateDetailsComponent;
  let fixture: ComponentFixture<OutGateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutGateDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutGateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
