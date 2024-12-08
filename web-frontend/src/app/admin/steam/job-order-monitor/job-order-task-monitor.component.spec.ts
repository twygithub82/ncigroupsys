import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamJobOrderTaskMonitorComponent } from './job-order-task-monitor.component';

describe('SteamJobOrderTaskMonitorComponent', () => {
  let component: SteamJobOrderTaskMonitorComponent;
  let fixture: ComponentFixture<SteamJobOrderTaskMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamJobOrderTaskMonitorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteamJobOrderTaskMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
