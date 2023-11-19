import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInStatusComponent } from './log-in-status.component';

describe('LogInStatusComponent', () => {
  let component: LogInStatusComponent;
  let fixture: ComponentFixture<LogInStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogInStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
