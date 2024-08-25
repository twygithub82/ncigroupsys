import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCleaningComponent } from './package-cleaning.component';

describe('PackageCleaningComponent', () => {
  let component: PackageCleaningComponent;
  let fixture: ComponentFixture<PackageCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageCleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
