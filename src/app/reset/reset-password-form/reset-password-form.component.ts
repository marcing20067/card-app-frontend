import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Form } from 'src/app/shared/util/form';
import { ResetPasswordData } from './reset-password-data.model';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
})
export class ResetPasswordFormComponent
  extends Form<ResetPasswordData>
  implements OnDestroy
{
  formSub!: Subscription;

  constructor() {
    super();

    this.formSub = this.form.valueChanges.subscribe((value) => {
      const isSimilar = value.newPassword === value.repeatNewPassword;
      this.form
        .get('repeatNewPassword')!
        .setErrors(isSimilar ? null : { similar: 'false' });
    });
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
