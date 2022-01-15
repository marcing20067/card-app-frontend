import { Directive, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class ResetForm {
  abstract resetForm: FormGroup;

  @Output() submitEvent = new EventEmitter<any>();

  onSubmit() {
    this.submitEvent.emit(this.resetForm.value);
  }
}
