import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthComponent } from './auth.component';

export function similarValidator(
  this: AuthComponent,
  data: { similarKey: string; errorKey: string }
) {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const similarKeyValue = this.authForm.value[data.similarKey];
    if (similarKeyValue && password !== similarKeyValue) {
      return { [data.errorKey]: { value: password } };
    }

    return null;
  };
}
