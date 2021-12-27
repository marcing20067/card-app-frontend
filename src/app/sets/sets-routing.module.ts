import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth/auth.guard';
import { SetsCreateComponent } from './sets-create/sets-create.component';
import { SetsLearnComponent } from './sets-learn/sets-learn.component';
import { SetsPanelComponent } from './sets-panel/sets-panel.component';

const routes: Routes = [
  {
    path: '',
    component: SetsPanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: SetsCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create/:id',
    component: SetsCreateComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'learn/:id',
    component: SetsLearnComponent,
    canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetsRoutingModule {}
