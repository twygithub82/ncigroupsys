import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLanguageDialogComponent } from './change-language-dialog.component';

describe('ChangeLanguageDialogComponent', () => {
  let component: ChangeLanguageDialogComponent;
  let fixture: ComponentFixture<ChangeLanguageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ChangeLanguageDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLanguageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
