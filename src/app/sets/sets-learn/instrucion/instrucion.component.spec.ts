import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrucionComponent } from './instrucion.component';

describe('InstrucionComponent', () => {
  let component: InstrucionComponent;
  let fixture: ComponentFixture<InstrucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
