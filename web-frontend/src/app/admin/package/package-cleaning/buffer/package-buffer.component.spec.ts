import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBufferComponent } from './package-buffer.component';

describe('PackageBufferComponent', () => {
  let component: PackageBufferComponent;
  let fixture: ComponentFixture<PackageBufferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageBufferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
