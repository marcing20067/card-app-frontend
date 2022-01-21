import { Validators } from '@angular/forms';

const username = [
  Validators.required,
  Validators.minLength(4),
  Validators.pattern(/^[a-z]{1,}$/i),
];

const password = [Validators.required, Validators.minLength(8)];

const email = [
  Validators.required,
  Validators.pattern(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
  ),
];

const repeatPassword = Validators.required;

export const AuthValidators = {
  username,
  password,
  email,
  repeatPassword,
};
