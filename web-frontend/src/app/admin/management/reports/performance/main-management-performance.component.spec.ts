import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainManagementMonthlyComponent } from './main-management-monthly.component';

describe('MainManagementMonthlyComponent', () => {
  let component: MainManagementMonthlyComponent;
  let fixture: ComponentFixture<MainManagementMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainManagementMonthlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainManagementMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
