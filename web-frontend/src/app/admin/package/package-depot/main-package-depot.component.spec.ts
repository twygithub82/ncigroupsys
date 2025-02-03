import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPackageDepotComponent } from './main-package-depot.component';

describe('MainPackageDepotComponent', () => {
  let component: MainPackageDepotComponent;
  let fixture: ComponentFixture<MainPackageDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPackageDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPackageDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
