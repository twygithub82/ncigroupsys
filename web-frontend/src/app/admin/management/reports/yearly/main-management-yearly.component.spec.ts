import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainManagementYearlyComponent } from './main-management-yearly.component';

describe('MainManagementYearlyComponent', () => {
  let component: MainManagementYearlyComponent;
  let fixture: ComponentFixture<MainManagementYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainManagementYearlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainManagementYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
