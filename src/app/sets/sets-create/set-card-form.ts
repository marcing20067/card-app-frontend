import { FormControl } from '@angular/forms';

export type SetCardForm = {
  concept: FormControl<string>;
  definition: FormControl<string>;
  example: FormControl<string>;
  group: FormControl<number>;
};
