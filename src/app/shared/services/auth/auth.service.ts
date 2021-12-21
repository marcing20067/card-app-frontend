import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { newUser } from '../../models/newUser.model';
import { User } from '../../models/user.model';
import { tap } from 'rxjs/operators';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { UserStatus } from '../../models/userStatus.model';

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
        refreshToken: string;
        accessTokenExpiresIn: number;
        refreshTokenExpiresIn: number;
      }>(environment.BACKEND_URL + 'auth/login', user)
      .pipe(
        tap((tokenData) => {
          this.tokenService.setTokenData(
            {
              accessToken: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              accessTokenExpiresIn: tokenData.accessTokenExpiresIn,
              refreshTokenExpiresIn: tokenData.refreshTokenExpiresIn,
            },
            rememberMe
          );
          this.router.navigate(['/sets']);
        })
      );
  }

  signup(user: newUser) {
    return this.http.post(environment.BACKEND_URL + 'auth/signup', user);
  }

  userStatus() {
    return this.http.get<UserStatus>(environment.BACKEND_URL + 'auth/status');
  }

  activation(activationToken: string) {
    return this.http.get(
      environment.BACKEND_URL + `auth/activate/${activationToken}`
    ).pipe(tap(() => {
      this.router.navigate(['/auth/login']);
    }));
  }

  reset(mode: 'password' | 'username', username: string) {
    return this.http.post(environment.BACKEND_URL + `reset/${mode}`, {
      username: username,
    });
  }

  resetWithToken(mode: 'password' | 'username', token: string, data: any) {
    return this.http.put(environment.BACKEND_URL + `reset/${mode}/${token}`, data)
  }
}
