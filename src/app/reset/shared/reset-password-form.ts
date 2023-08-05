import { FormControl } from '@angular/forms';

export type ResetPasswordForm = {
  newPassword: FormControl<string>;
  repeatNewPassword: FormControl<string>;
};
