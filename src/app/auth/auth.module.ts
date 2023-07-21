import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ActivationComponent } from './activation/activation.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { SignupFormComponent } from './signup/signup-form/signup-form.component';

@NgModule({
  declarations: [
    ActivationComponent,
    LoginFormComponent,
    SignupFormComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule],
})
export class AuthModule {}
