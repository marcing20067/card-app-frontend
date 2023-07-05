import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Directive()
export abstract class Form<T extends { [key: string]: FormControl }> {
  @Input() form!: FormGroup<T>;

  @Output() submitForm = new EventEmitter<Required<typeof this.form.value>>();

  onSubmit() {
    this.submitForm.emit(this.form.value as Required<typeof this.form.value>);
  }
}
