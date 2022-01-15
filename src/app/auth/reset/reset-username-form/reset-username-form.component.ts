import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as AuthValidators from '../../validators';
import { ResetForm } from '../reset-form';

@Component({
  selector: 'app-reset-username-form',
  templateUrl: './reset-username-form.component.html',
  styleUrls: ['./reset-username-form.component.scss'],
})
export class ResetUsernameFormComponent extends ResetForm {
  resetForm = this.fb.group({
    newUsername: ['', AuthValidators.username],
  });

  constructor(private fb: FormBuilder) {
    super();
  }

  setAlreadyTakenErrorOnUsername() {
    this.resetForm.get('newUsername')!.setErrors({ alreadyTaken: true });
  }
}
