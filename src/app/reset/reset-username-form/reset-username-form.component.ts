import { Component } from '@angular/core';
import { Form } from 'src/app/shared/util/form';
import { ResetUsernameData } from './reset-username-data.model';

@Component({
  selector: 'app-reset-username-form',
  templateUrl: './reset-username-form.component.html',
  styleUrls: ['./reset-username-form.component.scss'],
})
export class ResetUsernameFormComponent extends Form<ResetUsernameData> {
  constructor() {
    super();
  }
}
