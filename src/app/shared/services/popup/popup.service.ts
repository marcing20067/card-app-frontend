import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PopupData } from 'src/app/layout/shared/popup-data.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private isOpen = false;
  private displayEvent$ = new Subject<PopupData | null>();
  private confirmEvent$ = new Subject<boolean>();

  getIsOpen() {
    return this.isOpen;
  }

  display(data: PopupData) {
    this.isOpen = true;
    this.displayEvent$.next(data);
  }

  getDisplayListener() {
    return this.displayEvent$.asObservable();
  }

  confirm(value: boolean) {
    this.isOpen = false;
    this.confirmEvent$.next(value);
    this.displayEvent$.next(null);
  }

  getConfirmEventListener() {
    return this.confirmEvent$.asObservable();
  }
}
