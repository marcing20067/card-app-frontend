import { FormControl } from '@angular/forms';

export type SignupForm = {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
};
