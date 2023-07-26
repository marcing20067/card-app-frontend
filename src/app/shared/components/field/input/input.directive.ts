import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appInput]',
})
export class InputDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('blur')
  onBlur() {
    this.handleInputValue();
  }
  
  ngOnInit() {
    this.handleInputValue();
  }

  private handleInputValue() {
    const isInputEmpty = this.el.nativeElement.value === '';
    if (isInputEmpty) {
      this.renderer.removeClass(this.el.nativeElement, 'input--not-empty');
    }
    if (!isInputEmpty) {
      this.renderer.addClass(this.el.nativeElement, 'input--not-empty');
    }
  }
}
