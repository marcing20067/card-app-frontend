import { HttpClient } from '@angular/common/http';
import { ViewFlags } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExpiresTokenData } from '../models/expiresTokenData.model';
import { TokenData } from '../models/tokenData.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient) {
   
  }
  private isAuth$ = new BehaviorSubject<boolean>(false);
  private tokenData: TokenData | Partial<TokenData> = {};

  isAuth() {
    this.tokenData.accessToken = this.getAccessToken();
    this.postRefreshToken().subscribe();
    if (
      !this.tokenData.accessTokenExpiresIn ||
      !this.tokenData.refreshTokenExpiresIn
    ) {
      this.tokenData.accessTokenExpiresIn = localStorage.getItem(
        'accessTokenExpiresIn'
      ) as string;
      this.tokenData.refreshTokenExpiresIn = localStorage.getItem(
        'refreshTokenExpiresIn'
      ) as string;
    }

    return this.checkTokenValid().pipe(
      take(1),
      tap((isTokenValid) => {
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

  getAccessToken() {
    let accessToken = this.tokenData?.accessToken;
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken') as string;
    }
    return accessToken;
  }

  checkTokenValid() {
    const TIME_UNTIL_VALIDATION_IN_MINUTES = 3;
    const now = new Date();
    now.setMinutes(now.getMinutes() - TIME_UNTIL_VALIDATION_IN_MINUTES);

    const isAccessTokenValid =
      new Date(<string>this.tokenData.accessTokenExpiresIn) > now;
    if (isAccessTokenValid) {
      return of(true);
    }

    const isRefreshTokenValid =
      new Date(<string>this.tokenData.refreshTokenExpiresIn) > now;
    if (isRefreshTokenValid) {
      return this.postRefreshToken();
    }
    return of(false);
  }

  postRefreshTokenCalling = false;
  private postRefreshToken() {
    if (this.postRefreshTokenCalling) {
      return of(false);
    }
    this.postRefreshTokenCalling = true;
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
        tap((res) => {
          console.log(res);
          this.postRefreshTokenCalling = false;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  setTokenData(data: any, rememberMe: boolean) {
    const accessTokenDate = new Date();
    accessTokenDate.setMilliseconds(data.accessTokenExpiresIn);
    const refreshTokenDate = new Date();
    refreshTokenDate.setMilliseconds(data.refreshTokenExpiresIn);

    this.tokenData.accessToken = data.accessToken.toLocaleString('eng');
    (this.tokenData.accessTokenExpiresIn =
      accessTokenDate.toLocaleString('eng')),
      (this.tokenData.refreshTokenExpiresIn =
        refreshTokenDate.toLocaleString('eng'));

    if (rememberMe) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem(
        'accessTokenExpiresIn',
        `${this.tokenData.accessTokenExpiresIn}`
      );
      localStorage.setItem(
        'refreshTokenExpiresIn',
        `${this.tokenData.refreshTokenExpiresIn}`
      );
    }
  }

  private clearTokenData() {
    // this.tokenData = {};
    // localStorage.clear();
  }
}
