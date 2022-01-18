import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetComponent } from './reset.component';

const routes: Routes = [
  {
    path: 'username/:token',
    component: ResetComponent,
  },
  {
    path: 'password/:token',
    component: ResetComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'prefix',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetRoutingModule {}
