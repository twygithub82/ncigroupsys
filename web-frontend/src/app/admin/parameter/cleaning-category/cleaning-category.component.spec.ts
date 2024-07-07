import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningCategoryComponent } from './cleaning-category.component';

describe('CleaningCategoryComponent', () => {
  let component: CleaningCategoryComponent;
  let fixture: ComponentFixture<CleaningCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
