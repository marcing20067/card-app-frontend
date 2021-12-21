import { Validators } from '@angular/forms';

export const username = [
  Validators.required,
  Validators.minLength(4),
  Validators.pattern(/[a-z]/i),
];

export const password = [Validators.required, Validators.minLength(8)];

export const email = [
  Validators.required,
  Validators.pattern(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
  ),
];

export const repeatPassword = Validators.required;
