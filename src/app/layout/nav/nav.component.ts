import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  class = ['nav'];
  isAuth$ = this.tokenService.getIsAuthListener();
  isActive = false;

  constructor(
    private tokenService: TokenService,
    private popupService: PopupService,
    private layoutService: LayoutService,
    private authService: AuthService,
    private scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.tokenService.isAuth();
    this.sub = this.layoutService.onUrlChange('Nav').subscribe((feature) => {
      if (!feature) {
        return;
      }
      this.class = ['nav'];
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`nav--${f}`);
      });
    });
  }
  onActive(value: boolean) {
    this.isActive = value;
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
