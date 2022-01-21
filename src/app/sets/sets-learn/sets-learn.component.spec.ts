import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsLearnComponent } from './sets-learn.component';

describe('SetsLearnComponent', () => {
  let component: SetsLearnComponent;
  let fixture: ComponentFixture<SetsLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetsLearnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetsLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
