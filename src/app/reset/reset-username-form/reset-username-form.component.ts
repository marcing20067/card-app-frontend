import { Component } from '@angular/core';
import { DummyForm } from 'src/app/shared/util/dummy-form';
import { ResetPasswordForm } from '../reset-password-form/reset-password-form';

@Component({
  selector: 'app-reset-username-form',
  templateUrl: './reset-username-form.component.html',
  styleUrls: ['./reset-username-form.component.scss'],
})
export class ResetUsernameFormComponent extends DummyForm<ResetPasswordForm> {
  constructor() {
    super();
  }
}
