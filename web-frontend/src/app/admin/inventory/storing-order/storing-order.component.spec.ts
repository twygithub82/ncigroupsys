import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoringOrderComponent } from './storing-order.component';

describe('CleaningProceduresComponent', () => {
  let component: StoringOrderComponent;
  let fixture: ComponentFixture<StoringOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoringOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoringOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
