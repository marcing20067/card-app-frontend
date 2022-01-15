import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as AuthValidators from '../../validators';
import { ResetForm } from '../reset-form';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
})
export class ResetPasswordFormComponent extends ResetForm implements OnDestroy {
  resetForm = this.fb.group({
    newPassword: ['', AuthValidators.password],
    repeatNewPassword: ['', AuthValidators.repeatPassword],
  });

  formSub!: Subscription;

  constructor(private fb: FormBuilder) {
    super();

    this.formSub = this.resetForm.valueChanges.subscribe((value) => {
      const isSimilar = value.newPassword === value.repeatNewPassword;
      this.resetForm
        .get('repeatNewPassword')
        ?.setErrors(isSimilar ? null : { similar: 'false' });
    });
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
