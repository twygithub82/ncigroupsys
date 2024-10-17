import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningApprovalComponent } from './approval.component';

describe('CleaningProceduresComponent', () => {
  let component: CleaningApprovalComponent;
  let fixture: ComponentFixture<CleaningApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
