import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Component({
  selector: 'app-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
})
export class NavListComponent {
  isActive = false;
  @Output() navEvent = new EventEmitter<boolean>();
  isAuth$ = this.tokenService.getIsAuthListener();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private popupService: PopupService,
    private scrollService: ScrollService
  ) {
    this.tokenService.isAuth();
  }

  onNav(value: boolean) {
    this.isActive = value;
    this.navEvent.emit(value);
    if (this.isActive) {
      this.scrollService.blockScroll();
    }

    if (!this.isActive) {
      this.scrollService.unLockScroll();
    }
  }

  onLogout() {
    this.popupService
      .getConfirmEventListener()
      .pipe(take(1))
      .subscribe((isConfirm) => {
        if (isConfirm) {
          this.authService.logout().pipe(take(1)).subscribe();
        }
      });

    this.popupService.display({
      isShow: true,
      content: {
        heading: 'Czy na pewno chcesz się wylogować?',
      },
    });
  }
}

