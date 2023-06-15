import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Directive()
export abstract class Form<T extends object> {
  @Input() form!: UntypedFormGroup;

  @Output() submitForm = new EventEmitter<T>();

  onSubmit() {
    this.submitForm.emit(this.form.value);
  }
}
