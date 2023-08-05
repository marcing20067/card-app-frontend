import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PopupData } from 'src/app/layout/popup/popup-data.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private displayEvent$ = new Subject<PopupData | null>();
  private confirmEvent$ = new Subject<boolean>();

  constructor() {}

  display(data: PopupData) {
    this.displayEvent$.next(data);
  }

  getDisplayListener() {
    return this.displayEvent$.asObservable();
  }

  confirm(value: boolean) {
    this.confirmEvent$.next(value);
    this.displayEvent$.next(null);
  }

  getConfirmEventListener() {
    return this.confirmEvent$.asObservable();
  }
}
