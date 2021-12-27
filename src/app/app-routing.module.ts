import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshGuard } from './shared/guards/auth/refresh.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'prefix',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canLoad: [RefreshGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canLoad: [RefreshGuard],
  },
  {
    path: 'sets',
    loadChildren: () => import('./sets/sets.module').then((m) => m.SetsModule),
    canLoad: [RefreshGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user-panel/user-panel.module').then((m) => m.UserPanelModule),
    canLoad: [RefreshGuard],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
    canLoad: [RefreshGuard],
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'prefix',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
