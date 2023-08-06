import { Component } from '@angular/core';
import { SimpleForm } from 'src/app/shared/util/simple-form';
import { ResetUsernameForm } from '../shared/reset-username-form';

@Component({
  selector: 'app-reset-username-form',
  templateUrl: './reset-username-form.component.html',
  styleUrls: ['./reset-username-form.component.scss'],
})
export class ResetUsernameFormComponent extends SimpleForm<ResetUsernameForm> {
  constructor() {
    super();
  }
}
