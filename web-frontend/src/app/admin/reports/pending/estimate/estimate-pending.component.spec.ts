import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatePendingComponent } from './estimate-pending.component';

describe('EstimatePendingComponent', () => {
  let component: EstimatePendingComponent;
  let fixture: ComponentFixture<EstimatePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimatePendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimatePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
