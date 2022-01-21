import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../shared/guards/auth/logged.guard';
import { ActivationComponent } from './activation/activation.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'prefix',
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'signup',
    component: AuthComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'activation/:activationToken',
    component: ActivationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
