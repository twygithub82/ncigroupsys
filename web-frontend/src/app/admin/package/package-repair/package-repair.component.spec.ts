import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageRepairComponent } from './package-repair.component';

describe('PackageRepairComponent', () => {
  let component: PackageRepairComponent;
  let fixture: ComponentFixture<PackageRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageRepairComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
