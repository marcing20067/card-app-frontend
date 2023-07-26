import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function setFormError<T extends { [key: string]: AbstractControl }>(
  form: FormGroup<T>,
  error: ValidationErrors,
  controlName?: keyof typeof form.controls
) {
  setTimeout(() => {
    if (controlName) {
      form.controls[controlName].setErrors(error);
      return;
    }
    form.setErrors(error);
  }, 0);
}
