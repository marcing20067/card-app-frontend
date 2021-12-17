import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPanelRoutingModule } from './user-panel-routing.module';
import { UserPanelComponent } from './user-panel.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserPanelComponent],
  imports: [CommonModule, UserPanelRoutingModule, SharedModule],
})
export class UserPanelModule {}
