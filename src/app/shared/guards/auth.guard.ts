import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    const isAuth = this.tokenService.isAuth();
    if (isAuth) {
      return of(true);
    } else {
      return of(this.router.parseUrl('/auth/login'));
    }
  }
}
