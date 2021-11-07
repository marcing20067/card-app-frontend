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
  private tokenData: TokenData = {
    accessTokenExpiresIn: 0,
    refreshTokenExpiresIn: 0,
    accessToken: '',
  };

  isAuth() {
    const expiresData = this.getExpiresData();
    this.tokenData = {
      accessToken: this.getAccessToken(),
      ...expiresData
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
    let accessToken = this.tokenData.accessToken;
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken') as string;
    }
    return accessToken;
  }

  getExpiresData(): ExpiresTokenData {
    let accessTokenExpiresIn = this.tokenData.accessTokenExpiresIn;
    let refreshTokenExpiresIn = this.tokenData.refreshTokenExpiresIn;

    if (!accessTokenExpiresIn || !refreshTokenExpiresIn) {
      accessTokenExpiresIn = +(localStorage.getItem('accessTokenExpiresIn') as string);
      refreshTokenExpiresIn = +(localStorage.getItem('refreshTokenExpiresIn') as string);
    }
    return {
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  checkTokenValid() {
    const MAX_TIME = 10800;
    const now = Date.now();

    const isAccessTokenValid =
      this.tokenData.accessTokenExpiresIn > now - MAX_TIME;
    if (isAccessTokenValid) {
      return of(true);
    }

    const isRefreshTokenValid =
      this.tokenData.accessTokenExpiresIn > now - MAX_TIME;
    if (!isRefreshTokenValid) {
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
      const accessTokenExpiresIn = now + this.tokenData.accessTokenExpiresIn;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('accessTokenExpiresIn', `${accessTokenExpiresIn}`);
      localStorage.setItem('refreshTokenExpiresIn', `${accessTokenExpiresIn}`);
    }
  }
}
