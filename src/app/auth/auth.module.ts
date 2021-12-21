import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ActivationComponent } from './activation/activation.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [AuthComponent, ActivationComponent, ResetComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule],
})
export class AuthModule {}
