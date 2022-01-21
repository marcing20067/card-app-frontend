import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { PopupComponent } from './popup/popup.component';
import { NavListComponent } from './nav/nav-list/nav-list.component';

@NgModule({
  declarations: [
    NavComponent,
    FooterComponent,
    PopupComponent,
    NavListComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [NavComponent, FooterComponent, PopupComponent],
})
export class LayoutModule {}
