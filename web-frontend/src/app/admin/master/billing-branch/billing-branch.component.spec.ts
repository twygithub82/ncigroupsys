import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageResidueComponent } from './package-residue.component';

describe('PackageResidueComponent', () => {
  let component: PackageResidueComponent;
  let fixture: ComponentFixture<PackageResidueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageResidueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageResidueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
