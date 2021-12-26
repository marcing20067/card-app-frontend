import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { TokenData } from '../../models/tokenData.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private isAuth$ = new BehaviorSubject<boolean>(false);
  private tokenData: Partial<TokenData> = {};

  isAuth() {
    const isTokensValidity = this.checkTokensValidity();
    if(!isTokensValidity) {
      this.clearTokenData();
    }
    this.isAuth$.next(isTokensValidity);
    return isTokensValidity;
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

  setTokenData(data: any) {
    const TIME_UNTIL_VALIDATION_IN_MINUTES = 3;
    const now = Date.now();

    const accessTokenEndValidity =
      now +
      data.accessTokenExpiresIn -
      TIME_UNTIL_VALIDATION_IN_MINUTES * 60000;

    this.tokenData = {
      accessToken: data.accessToken,
      accessTokenEndValidity,
    };
  }

  clearTokenData() {
    this.tokenData = {};
    localStorage.clear();
  }

  changeIsAuth(isAuth: boolean) {
    this.isAuth$.next(isAuth);
  }
}
