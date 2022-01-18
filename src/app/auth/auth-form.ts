import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class AuthForm<T extends object> {
  @Input() form!: FormGroup;

  @Output() submit = new EventEmitter<T>();

  onSubmit() {
    this.submit.emit(this.form.value);
  }
}

