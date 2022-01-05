import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { of } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}
  canActivate() {
    const isAuth = this.tokenService.isAuth();
    if (isAuth) {
      return of(true);
    } else {
      return of(this.router.parseUrl('/auth/login'));
    }
  }
}
