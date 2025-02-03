import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPackageCleaningComponent } from './main-package-clean.component';

describe('MainPackageCleaningComponent', () => {
  let component: MainPackageCleaningComponent;
  let fixture: ComponentFixture<MainPackageCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPackageCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPackageCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
