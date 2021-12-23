import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { TokenData } from '../../models/tokenData.model';

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
        return false;
      }

      this.tokenData = {
        accessToken,
        accessTokenEndValidity,
        refreshTokenEndValidity,
      };
    }

    const isTokensValid = this.checkTokensValidity();
    this.isAuth$.next(isTokensValid);
    if (!isTokensValid) {
      this.clearTokenData();
    }
    return isTokensValid;
  }

  getIsAuthListener() {
    return this.isAuth$.asObservable().pipe(distinctUntilChanged());
  }

  checkTokensValidity() {
    const now = Date.now();
    const isAccessTokenValid =
      (this.tokenData.accessTokenEndValidity || 0) > now;
    if (isAccessTokenValid) {
      return true;
    }
    return false;
  }

  getAccessToken() {
    return this.tokenData.accessToken;
  }

  setTokenData(data: any, rememberMe: boolean) {
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

  clearTokenData() {
    this.tokenData = {};
    localStorage.clear();
  }

  changeIsAuth(isAuth: boolean) {
    this.isAuth$.next(isAuth);
  }
}
