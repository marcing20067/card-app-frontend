import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsPanelComponent } from './sets-panel.component';

describe('SetsPanelComponent', () => {
  let component: SetsPanelComponent;
  let fixture: ComponentFixture<SetsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
