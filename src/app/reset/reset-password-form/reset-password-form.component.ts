import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Form } from 'src/app/shared/util/form';
import { ResetPasswordForm } from './reset-password-form';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
})
export class ResetPasswordFormComponent
  extends Form<ResetPasswordForm>
  implements OnInit, OnDestroy
{
  formSub!: Subscription;

  constructor() {
    super();
  }

  ngOnInit() {
    this.formSub = this.form.valueChanges.subscribe((value) => {
      const isSimilar = value.newPassword === value.repeatNewPassword;
      this.form.controls.repeatNewPassword.setErrors(
        isSimilar ? null : { similar: 'false' }
      );
    });
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
