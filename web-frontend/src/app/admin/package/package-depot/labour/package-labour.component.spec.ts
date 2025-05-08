import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageLabourComponent } from './package-labour.component';

describe('PackageLabourComponent', () => {
  let component: PackageLabourComponent;
  let fixture: ComponentFixture<PackageLabourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageLabourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageLabourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
