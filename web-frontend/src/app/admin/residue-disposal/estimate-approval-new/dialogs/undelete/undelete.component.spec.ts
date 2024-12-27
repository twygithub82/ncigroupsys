import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndeleteDialogComponent } from './undelete.component';

describe('DeleteDialogComponent', () => {
  let component: UndeleteDialogComponent;
  let fixture: ComponentFixture<UndeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UndeleteDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
