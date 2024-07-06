import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningMethodsComponent } from './cleaning-methods.component';

describe('CleaningMethodsComponent', () => {
  let component: CleaningMethodsComponent;
  let fixture: ComponentFixture<CleaningMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningMethodsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
