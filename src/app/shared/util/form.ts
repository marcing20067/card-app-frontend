import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive()
export abstract class Form<
  T extends { [K in keyof T]: AbstractControl }
> {
  @Input() form!: FormGroup<T>;

  @Output() submitForm = new EventEmitter<
    ReturnType<typeof this.form.getRawValue>
  >();

  onSubmit() {
    this.submitForm.emit(
      this.form.value as ReturnType<typeof this.form.getRawValue>
    );
  }
}
