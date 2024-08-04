import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseOrderComponent } from './release-order.component';

describe('CleaningProceduresComponent', () => {
  let component: ReleaseOrderComponent;
  let fixture: ComponentFixture<ReleaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
