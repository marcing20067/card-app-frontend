import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetRoutingModule } from './reset-routing.module';
import { ResetComponent } from './reset.component';
import { ResetUsernameFormComponent } from './reset-username-form/reset-username-form.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ResetComponent,
    ResetUsernameFormComponent,
    ResetPasswordFormComponent,
  ],
  imports: [
    CommonModule,
    ResetRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ResetModule {}
