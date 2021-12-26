import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tokenService.isAuth();
    this.sub = this.layoutService.onUrlChange('Nav').subscribe((feature) => {
      this.class = ['nav'];
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`nav--${f}`);
      });
    });
  }

  onToggleActive() {
    this.isActive = !this.isActive;
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
