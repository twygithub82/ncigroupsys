import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseOrderDetailsComponent } from './release-order-details.component';

describe('CleaningProceduresComponent', () => {
  let component: ReleaseOrderDetailsComponent;
  let fixture: ComponentFixture<ReleaseOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseOrderDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleaseOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
