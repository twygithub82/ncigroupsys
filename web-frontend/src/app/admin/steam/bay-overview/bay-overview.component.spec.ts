import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayOverviewComponent } from './bay-overview.component';

describe('BayOverviewComponent', () => {
  let component: BayOverviewComponent;
  let fixture: ComponentFixture<BayOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BayOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BayOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
