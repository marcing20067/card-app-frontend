import { Component } from '@angular/core';
import { PopupService } from 'src/app/shared/services/popup/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  constructor(private popupService: PopupService) {}
  data$ = this.popupService.getDisplayListener();
  isShow = false;

  onConfirm(isConfirm: boolean) {
    this.popupService.confirm(isConfirm);
  }
}
