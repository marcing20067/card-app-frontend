import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetsRoutingModule } from './sets-routing.module';
import { SetsCreateComponent } from './sets-create/sets-create.component';
import { SetsLearnComponent } from './sets-learn/sets-learn.component';
import { SetsPanelComponent } from './sets-panel/sets-panel.component';
import { SetsComponent } from './sets.component';


@NgModule({
  declarations: [SetsComponent, SetsCreateComponent, SetsLearnComponent, SetsPanelComponent],
  imports: [
    CommonModule,
    SetsRoutingModule
  ]
})
export class SetsModule { }
