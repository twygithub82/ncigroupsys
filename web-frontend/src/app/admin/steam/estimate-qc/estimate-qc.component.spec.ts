import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairQCViewComponent } from './estimate-qc.component';

describe('RepairQCViewComponent', () => {
  let component: RepairQCViewComponent;
  let fixture: ComponentFixture<RepairQCViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairQCViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepairQCViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
