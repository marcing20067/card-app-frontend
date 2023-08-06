import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate() {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return of(true);
    }
    return of(this.router.parseUrl('/auth/login'));
  }
}
