import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewUser } from './new-user.model';
import { User } from './user.model';
import { tap } from 'rxjs/operators';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(user: User, rememberMe: boolean) {
    return this.http
      .post<{
        accessToken: string;
        accessTokenExpiresIn: number;
      }>(environment.BACKEND_URL + 'auth/login', user, {
        params: { rememberMe: rememberMe },
      })
      .pipe(
        tap((tokenData) => {
          this.tokenService.setTokenData(tokenData);
          this.router.navigate(['/sets']);
        })
      );
  }

  signup(user: NewUser) {
    return this.http.post(environment.BACKEND_URL + 'auth/signup', user);
  }

  activation(activationToken: string) {
    return this.http
      .get(environment.BACKEND_URL + `auth/activate/${activationToken}`)
      .pipe(
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      );
  }

  logout() {
    return this.http.get(environment.BACKEND_URL + 'auth/logout').pipe(
      tap(() => {
        this.tokenService.changeIsAuth(false);
        this.tokenService.clearTokenData();
        this.router.navigate(['/auth/login']);
      })
    );
  }
}
