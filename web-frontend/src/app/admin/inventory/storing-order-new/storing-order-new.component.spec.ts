import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoringOrderNewComponent } from './storing-order-new.component';

describe('CleaningProceduresComponent', () => {
  let component: StoringOrderNewComponent;
  let fixture: ComponentFixture<StoringOrderNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoringOrderNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoringOrderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
