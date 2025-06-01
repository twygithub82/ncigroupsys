import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRepairEstFormDialog } from './preview-repair-estimate.component';

describe('PreviewRepairEstFormDialog', () => {
  let component: PreviewRepairEstFormDialog;
  let fixture: ComponentFixture<PreviewRepairEstFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewRepairEstFormDialog]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewRepairEstFormDialog);
    component = fixture.componentInstance;PreviewRepairEstFormDialog
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
