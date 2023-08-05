import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { SetCardForm } from "./set-card-form";

export type SetsForm = {
  name: FormControl<string>;
  cards: FormArray<FormGroup<SetCardForm>>
}
