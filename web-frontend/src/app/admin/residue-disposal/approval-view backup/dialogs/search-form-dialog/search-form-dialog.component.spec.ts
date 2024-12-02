import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormDialogComponent } from './search-form-dialog.component';

describe('SearchFormDialogComponent', () => {
  let component: SearchFormDialogComponent;
  let fixture: ComponentFixture<SearchFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SearchFormDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
