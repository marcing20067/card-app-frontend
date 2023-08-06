import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewUser } from './new-user.model';
import { User } from './user.model';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth$ = new BehaviorSubject(false);
  private isRefreshCalled$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  getIsAuthListener() {
    return this.isAuth$.asObservable().pipe(distinctUntilChanged());
  }

  changeIsAuth(isAuth: boolean) {
    this.isAuth$.next(isAuth);
  }

  isAuth() {
    const areTokensValidity = this.tokenService.areTokensValidity();
    if (!areTokensValidity) {
      this.tokenService.clearTokenData();
    }
    this.isAuth$.next(areTokensValidity);
    return areTokensValidity;
  }

  getIsRefreshCalledListener() {
    return this.isRefreshCalled$.asObservable();
  }

  refresh() {
    return this.http
      .post<{
        error?: string;
        accessToken?: string;
        accessTokenExpiresIn?: number;
      }>(environment.BACKEND_URL + 'refresh', {})
      .pipe(
        tap(
          (tokenData) => {
            if (tokenData.error) {
              this.isRefreshCalled$.next(true);
              return;
            }

            const { accessToken, accessTokenExpiresIn } = tokenData;
            if (accessToken && accessTokenExpiresIn) {
              this.changeIsAuth(true);
              this.isRefreshCalled$.next(true);
              this.tokenService.setTokenData({
                accessToken,
                accessTokenExpiresIn,
              });
            }
          },
          () => {
            this.isRefreshCalled$.next(true);
          }
        )
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
        this.changeIsAuth(false);
        this.tokenService.clearTokenData();
        this.router.navigate(['/auth/login']);
      })
    );
  }
}
