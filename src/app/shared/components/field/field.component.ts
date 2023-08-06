import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { IconComponent } from './icon/icon.component';
import { InputDirective } from './input/input.directive';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FieldComponent implements AfterContentInit, OnDestroy {
  @ContentChild(IconComponent) private icon!: IconComponent;
  @ContentChild(InputDirective, { read: ElementRef })
  private input!: ElementRef<HTMLInputElement>;
  private listeners: Array<() => void> = [];

  constructor(private renderer: Renderer2) {}

  ngAfterContentInit() {
    if (!this.icon) {
      return;
    }

    const input = this.input.nativeElement;
    const onFocus = this.renderer.listen(input, 'focus', () => {
      this.icon.changeIsOrange(true);
    });
    const onBlur = this.renderer.listen(input, 'blur', () => {
      this.icon.changeIsOrange(false);
    });
    this.listeners.push(onFocus, onBlur);
  }

  ngOnDestroy() {
    this.listeners.forEach((l) => l());
  }
}
