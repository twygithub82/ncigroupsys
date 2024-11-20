import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankMovementComponent } from './tank-movement.component';

describe('TankMovementComponent', () => {
  let component: TankMovementComponent;
  let fixture: ComponentFixture<TankMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankMovementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
