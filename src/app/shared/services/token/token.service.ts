import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { TokenData } from '../../models/token-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private isAuth$ = new BehaviorSubject(false);
  private tokenData: Partial<TokenData> = {};
  private isRefreshCalled$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  getAccessToken() {
    return this.tokenData.accessToken;
  }

  changeIsAuth(isAuth: boolean) {
    this.isAuth$.next(isAuth);
  }

  getIsAuthListener() {
    return this.isAuth$.asObservable().pipe(distinctUntilChanged());
  }

  isAuth() {
    const areTokensValidity = this.checkTokensValidity();
    if (!areTokensValidity) {
      this.clearTokenData();
    }
    this.isAuth$.next(areTokensValidity);
    return areTokensValidity;
  }

  clearTokenData() {
    this.tokenData = {};
    localStorage.clear();
  }

  setTokenData(newData: { accessToken: string; accessTokenExpiresIn: number }) {
    const TIME_UNTIL_VALIDATION_IN_MINUTES = 3;
    const now = Date.now();

    const accessTokenEndValidity =
      now +
      newData.accessTokenExpiresIn -
      TIME_UNTIL_VALIDATION_IN_MINUTES * 60000;

    this.tokenData = {
      accessToken: newData.accessToken,
      accessTokenEndValidity,
    };
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
              this.setTokenData({
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

  private checkTokensValidity() {
    const now = Date.now();
    const isAccessTokenValid =
      (this.tokenData.accessTokenEndValidity || 0) > now;
    return isAccessTokenValid;
  }
}
