import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FieldService } from '../field.service';

@Directive({
  selector: '[appInput]',
})
export class InputDirective {
  private id: string = '';
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private fieldService: FieldService
  ) {}

  ngOnInit() {
    this.id = this.el.nativeElement.id;
    this.handleInputValue();
  }

  @HostListener('focus')
  onFocus() {
    this.fieldService.changeFieldState({
      [this.id]: { isFocus: true },
    });
  }

  @HostListener('blur')
  onBlur() {
    this.handleInputValue();
    this.fieldService.changeFieldState({
      [this.id]: { isFocus: false },
    });
  }

  handleInputValue() {
    const isInputEmpty = this.el.nativeElement.value === '';
    if (isInputEmpty) {
      this.renderer.removeClass(this.el.nativeElement, 'input--not-empty');
    }
    if (!isInputEmpty) {
      this.renderer.addClass(this.el.nativeElement, 'input--not-empty');
    }
  }
}
