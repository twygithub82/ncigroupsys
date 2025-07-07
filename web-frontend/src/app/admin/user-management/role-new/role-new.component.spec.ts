import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleNewComponent } from './role-new.component';

describe('RoleNewComponent', () => {
  let component: RoleNewComponent;
  let fixture: ComponentFixture<RoleNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
