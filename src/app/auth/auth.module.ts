import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ActivationComponent } from './activation/activation.component';
import { ResetComponent } from './reset/reset.component';
import { ResetUsernameFormComponent } from './reset/reset-username-form/reset-username-form.component';
import { ResetPasswordFormComponent } from './reset/reset-password-form/reset-password-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';

@NgModule({
  declarations: [AuthComponent, ActivationComponent, ResetComponent, ResetUsernameFormComponent, ResetPasswordFormComponent, LoginFormComponent, SignupFormComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule],
})
export class AuthModule {}
