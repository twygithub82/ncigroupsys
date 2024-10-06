import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalViewComponent } from './approval-view.component';

describe('ApprovalViewComponent', () => {
  let component: ApprovalViewComponent;
  let fixture: ComponentFixture<ApprovalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
