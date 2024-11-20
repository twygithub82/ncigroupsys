import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankMovementDetailsComponent } from './tank-movement-details.component';

describe('TankMovementDetailsComponent', () => {
  let component: TankMovementDetailsComponent;
  let fixture: ComponentFixture<TankMovementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankMovementDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankMovementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
