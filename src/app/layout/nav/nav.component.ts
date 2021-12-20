import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavExtraFeaturesForRoute } from 'src/app/shared/enums/layout.enums';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { ActualRoute } from 'src/app/shared/types/actualRoute.type';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  class = ['nav'];
  isActive = false;
  isAuth$ = this.tokenService.getIsAuthListener();

  constructor(
    private tokenService: TokenService,
    private popupService: PopupService,
    private layoutService: LayoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tokenService.isAuth();
    this.sub = this.layoutService.onUrlChange('Nav').subscribe((feature) => {
      this.class = ['nav'];
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`nav--${f}`);
      });
    });
    
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
          this.tokenService.clearTokenData();
          this.router.navigate(['/auth/login']);
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
