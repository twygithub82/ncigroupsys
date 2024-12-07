import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairFormDialogComponent } from './repair-form-dialog.component';

describe('RepairFormDialogComponent', () => {
  let component: RepairFormDialogComponent;
  let fixture: ComponentFixture<RepairFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RepairFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
