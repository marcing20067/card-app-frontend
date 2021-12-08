import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  distinctUntilChanged,
  take,
  tap,
} from 'rxjs/operators';
import { TokenData } from '../models/tokenData.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private isAuth$ = new BehaviorSubject<boolean>(false);
  private tokenData: Partial<TokenData> = {};

  isAuth() {
    if (Object.keys(this.tokenData).length === 0) {
      const accessToken = localStorage.getItem('accessToken');
      const accessTokenEndValidity = Number(
        localStorage.getItem('accessTokenEndValidity')
      );
      const refreshTokenEndValidity = Number(
        localStorage.getItem('refreshTokenEndValidity')
      );

      if (!accessToken || !accessTokenEndValidity || !refreshTokenEndValidity) {
        return of(false);
      }

      this.tokenData = {
        accessToken,
        accessTokenEndValidity,
        refreshTokenEndValidity,
      };
    }

    return this.checkTokensValidity().pipe(
      take(1),
      tap((isTokenValid) => {
        console.log(isTokenValid)
        this.isAuth$.next(isTokenValid);
        if (!isTokenValid) {
          this.clearTokenData();
        }
      })
    );
  }

  getIsAuthListener() {
    return this.isAuth$.asObservable().pipe(distinctUntilChanged());
  }

  checkTokensValidity() {
    const now = Date.now();
    console.log(this.tokenData.accessTokenEndValidity || 0);
    const isAccessTokenValid = this.tokenData.accessTokenEndValidity || 0 > now;
    if (isAccessTokenValid) {
      return of(true);
    }
    return of(false);
  }

  getAccessToken() {
    return this.tokenData.accessToken;
  }

  setTokenData(data: any, rememberMe: boolean) {
    console.log(data)
    const TIME_UNTIL_VALIDATION_IN_MINUTES = 3;
    const now = Date.now();

    const accessTokenEndValidity =
      now +
      data.accessTokenExpiresIn -
      TIME_UNTIL_VALIDATION_IN_MINUTES * 60000;
    const refreshTokenEndValidity =
      now +
      data.refreshTokenExpiresIn -
      TIME_UNTIL_VALIDATION_IN_MINUTES * 60000;

    this.tokenData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenEndValidity,
      refreshTokenEndValidity,
    };

    if (rememberMe) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem(
        'accessTokenEndValidity',
        `${accessTokenEndValidity}`
      );
      localStorage.setItem(
        'refreshTokenEndValidity',
        `${refreshTokenEndValidity}`
      );
    }
  }

  private clearTokenData() {
    // this.tokenData = {};
    // localStorage.clear();
  }
}
