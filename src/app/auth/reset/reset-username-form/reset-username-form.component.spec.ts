import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUsernameFormComponent } from './reset-username-form.component';

describe('ResetUsernameFormComponent', () => {
  let component: ResetUsernameFormComponent;
  let fixture: ComponentFixture<ResetUsernameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetUsernameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetUsernameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
