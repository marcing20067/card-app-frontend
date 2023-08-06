import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return of(this.router.parseUrl('/sets'));
    }
    return of(true);
  }
}
