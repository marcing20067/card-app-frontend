import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivationComponent } from './activation/activation.component';
import { AuthComponent } from './auth.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'signup',
    component: AuthComponent,
  },
  {
    path: 'activation/:activationToken',
    component: ActivationComponent,
  },
  {
    path: 'reset/username/:token',
    component: ResetComponent,
  },
  {
    path: 'reset/password/:token',
    component: ResetComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'prefix',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
