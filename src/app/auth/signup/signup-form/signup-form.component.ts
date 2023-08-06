import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SimpleForm } from '../../../shared/util/simple-form';
import { SignupForm } from '../../shared/signup-form';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent extends SimpleForm<SignupForm> implements OnInit, OnDestroy {
  private formSub!: Subscription;
  constructor() {
    super();
  }

  ngOnInit() {
    this.formSub = this.form.valueChanges
      .pipe(
        distinctUntilChanged((prev, next) => {
          return (
            prev.repeatPassword === next.repeatPassword &&
            prev.password === next.password
          );
        })
      )
      .subscribe((value) => {
        const isSimilar = value.password === value.repeatPassword;
        this.form
          .controls.repeatPassword
          .setErrors(isSimilar ? null : { similar: 'false' });
      });
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
