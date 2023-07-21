import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private tokenService: TokenService, private router: Router) {}
  canActivate() {
    const isAuth = this.tokenService.isAuth();
    if (isAuth) {
      return of(true);
    }

    return of(this.router.parseUrl('/auth/login'));
  }
}
