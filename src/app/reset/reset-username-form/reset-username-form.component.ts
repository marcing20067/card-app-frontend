import { Component } from '@angular/core';
import { DummyForm } from 'src/app/shared/util/dummy-form';
import { ResetUsernameForm } from './reset-username-form';

@Component({
  selector: 'app-reset-username-form',
  templateUrl: './reset-username-form.component.html',
  styleUrls: ['./reset-username-form.component.scss'],
})
export class ResetUsernameFormComponent extends DummyForm<ResetUsernameForm> {
  constructor() {
    super();
  }
}
