import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetsCreateComponent } from './sets-create/sets-create.component';
import { SetsLearnComponent } from './sets-learn/sets-learn.component';
import { SetsPanelComponent } from './sets-panel/sets-panel.component';
import { SetsComponent } from './sets.component';

const routes: Routes = [
  {
    path: '',
    component: SetsComponent,
    children: [
      {
        path: '', 
        component: SetsPanelComponent
      },
      {
        path: 'create',
        component: SetsCreateComponent
      },
      {
        path: 'learn',
        component: SetsLearnComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetsRoutingModule {}
