import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamJobOrderTaskDetailsComponent } from './job-order-task-details.component';

describe('SteamJobOrderTaskDetailsComponent', () => {
  let component: SteamJobOrderTaskDetailsComponent;
  let fixture: ComponentFixture<SteamJobOrderTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamJobOrderTaskDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamJobOrderTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
