import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDepotComponent } from './package-depot.component';

describe('PackageDepotComponent', () => {
  let component: PackageDepotComponent;
  let fixture: ComponentFixture<PackageDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
