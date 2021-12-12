import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { PopupData } from 'src/app/layout/popup/popupData.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private displayEvent$ = new Subject<PopupData>();
  private confirmEvent$ = new Subject<boolean>();

  display(data: PopupData) {
    this.displayEvent$.next(data);
  }

  getDisplayListener() {
    return this.displayEvent$.asObservable();
  }

  confirm(value: boolean) {
    this.confirmEvent$.next(value);
    this.displayEvent$.next({ isShow: false });
  }

  getConfirmEventListener() {
    return this.confirmEvent$.asObservable();
  }
}
