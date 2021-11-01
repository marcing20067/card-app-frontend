import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FieldService } from '../field.service';

@Directive({
  selector: '[appInput]',
})
export class InputDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private fieldService: FieldService
  ) {}

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent) {
    const id = this.getInputId(event);
    this.fieldService.changeFieldState({
      [id]: {
        isFocus: true,
      },
    });
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const id = this.getInputId(event);
    this.fieldService.changeFieldState({ [id]: { isFocus: false } });

    const isInputEmpty = this.el.nativeElement.value === '';
    if (!isInputEmpty) {
      this.renderer.addClass(this.el.nativeElement, 'input--not-empty');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'input--not-empty');
    }
  }

  private getInputId(event: FocusEvent): string {
    const input = event.target as HTMLInputElement;
    return input.getAttribute('id') as string;
  }
}
