import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExpiresTokenData } from '../models/expiresTokenData.model';
import { TokenData } from '../models/tokenData.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {}
  private isAuth$ = new BehaviorSubject<boolean>(false);
  private tokenData: TokenData | null = null;

  isAuth() {
    if (!this.tokenData) {
      return of(false);
    }

    if (!this.tokenData.accessToken) {
      this.tokenData.accessToken = localStorage.getItem('accessToken') || '';
    }

    if (
      !this.tokenData.accessTokenExpiresIn ||
      !this.tokenData.refreshTokenExpiresIn
    ) {
      this.tokenData.accessTokenExpiresIn = Number(localStorage.getItem('accessTokenExpiresIn'));
      this.tokenData.refreshTokenExpiresIn = Number(localStorage.getItem('refreshTokenExpiresIn'));
    }

    return this.checkTokenValid().pipe(
      tap((isTokenValid) => {
        this.isAuth$.next(isTokenValid);
      })
    );
  }

  getIsAuthListener() {
    return this.isAuth$.asObservable().pipe(distinctUntilChanged());
  }

  getAccessToken() {
    let accessToken = this.tokenData?.accessToken;
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken') as string;
    }
    return accessToken;
  }

  checkTokenValid() {
    const TIME_UNTIL_VALIDATION = 180000;
    const now = Date.now();
    
    const isAccessTokenValid =
      this.tokenData!.accessTokenExpiresIn > now - TIME_UNTIL_VALIDATION;
    if (isAccessTokenValid) {
      return of(true);
    }

    const isRefreshTokenValid =
      this.tokenData!.accessTokenExpiresIn > now - TIME_UNTIL_VALIDATION;
    if (!isRefreshTokenValid) {
      this.clearTokenData();
      return of(false);
    }

    return this.http
      .post<ExpiresTokenData>(
        environment.BACKEND_URL + 'refresh',
        {},
        {
          observe: 'response',
        }
      )
      .pipe(
        switchMap((response) => {
          const accessToken = response.headers.get('X-Access-Token') as string;
          const expiresTokenData = response.body as ExpiresTokenData;
          this.setTokenData(
            {
              ...expiresTokenData,
              accessToken: accessToken,
            },
            true
          );
          return of(true);
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  setTokenData(data: TokenData, rememberMe: boolean) {
    const now = Date.now();
    this.tokenData = {
      ...data,
      accessTokenExpiresIn: now + data.accessTokenExpiresIn,
      refreshTokenExpiresIn: now + data.refreshTokenExpiresIn,
    };
    if (rememberMe) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem(
        'accessTokenExpiresIn',
        `${this.tokenData.accessTokenExpiresIn}`
      );
      localStorage.setItem(
        'refreshTokenExpiresIn',
        `${this.tokenData.accessTokenExpiresIn}`
      );
    }
  }

  clearTokenData() {
    this.tokenData = null;
    localStorage.clear();
  }
}
