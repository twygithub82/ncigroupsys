import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInvoicesDialogComponent } from './update-invoices.component';

describe('UpdateInvoicesDialogComponent', () => {
  let component: UpdateInvoicesDialogComponent;
  let fixture: ComponentFixture<UpdateInvoicesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateInvoicesDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInvoicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
