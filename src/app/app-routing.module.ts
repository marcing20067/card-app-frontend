import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthResolver } from './shared/services/auth/auth.resolver';
import { RefreshGuard } from './shared/services/auth/refresh.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'prefix',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canLoad: [RefreshGuard]
  },
  {
    path: 'sets',
    loadChildren: () => import('./sets/sets.module').then((m) => m.SetsModule),
    canLoad: [RefreshGuard]
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user-panel/user-panel.module').then((m) => m.UserPanelModule),
      canLoad: [RefreshGuard]
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
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
