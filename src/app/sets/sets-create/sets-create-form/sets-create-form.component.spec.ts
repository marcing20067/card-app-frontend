import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsCreateFormComponent } from './sets-create-form.component';

describe('SetsCreateFormComponent', () => {
  let component: SetsCreateFormComponent;
  let fixture: ComponentFixture<SetsCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetsCreateFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetsCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
