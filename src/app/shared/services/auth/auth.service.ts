import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { newUser } from '../../models/newUser.model';
import { User } from '../../models/user.model';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { UserStatus } from '../../models/userStatus.model';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private isRefreshCalled$ = new BehaviorSubject(false);

  getIsRefreshCalledListener() {
    return this.isRefreshCalled$.asObservable();
  }

  refresh() {
    return this.http
      .post<{
        error?: string;
        accessToken: string;
        accessTokenExpiresIn: number;
      }>(environment.BACKEND_URL + 'refresh', {})
      .pipe(
        tap(
          (tokenData) => {
            if (tokenData.error) {
              this.isRefreshCalled$.next(true);
              return;
            }
            this.tokenService.changeIsAuth(true);
            this.isRefreshCalled$.next(true);
            this.tokenService.setTokenData(tokenData);
          },
          () => {
            this.isRefreshCalled$.next(true);
          }
        ),
      );
  }

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
          this.tokenService.setTokenData({
            accessToken: tokenData.accessToken,
            accessTokenExpiresIn: tokenData.accessTokenExpiresIn,
          });
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
    return this.http
      .get(environment.BACKEND_URL + `auth/activate/${activationToken}`)
      .pipe(
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      );
  }

  reset(mode: 'password' | 'username', username: string) {
    return this.http.post(environment.BACKEND_URL + `reset/${mode}`, {
      username: username,
    });
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

  resetWithToken(mode: 'password' | 'username', token: string, data: any) {
    return this.http
      .put(environment.BACKEND_URL + `reset/${mode}/${token}`, data)
      .pipe(
        tap(() => {
          this.logout().pipe(take(1)).subscribe();
        })
      );
  }
}
