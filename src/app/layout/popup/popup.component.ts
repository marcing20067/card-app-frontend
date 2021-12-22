import { Component } from '@angular/core';
import { PopupService } from 'src/app/shared/services/popup/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  data$ = this.popupService.getDisplayListener();
  isShow = false;
  
  constructor(private popupService: PopupService) {}
  
  onConfirm(isConfirm: boolean) {
    this.popupService.confirm(isConfirm);
  }
}
