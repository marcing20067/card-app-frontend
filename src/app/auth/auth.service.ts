import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { newUser } from '../shared/models/newUser.model';
import { User } from '../shared/models/user.model';
import { TokenData } from '../shared/models/tokenData.model';
import { tap } from 'rxjs/operators';
import { TokenService } from '../shared/services/token.service';
import { ExpiresTokenData } from '../shared/models/expiresTokenData.model';
import { Router } from '@angular/router';

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
      .post<ExpiresTokenData>(environment.BACKEND_URL + 'login', user, {
        observe: 'response',
      })
      .pipe(
        tap((res) => {
          const expiresTokenData = res.body as ExpiresTokenData;
          const accessToken = res.headers.get('X-Access-Token') as string;
          this.tokenService.setTokenData(
            {
              accessToken: accessToken,
              accessTokenExpiresIn: expiresTokenData.accessTokenExpiresIn,
              refreshTokenExpiresIn: expiresTokenData.refreshTokenExpiresIn,
            },
            rememberMe
          );
          this.router.navigate(['/sets']);
        })
      );
  }

  signup(user: newUser) {
    return this.http.post(environment.BACKEND_URL + 'signup', user).pipe(
      tap(() => {
        this.router.navigate(['/auth/login']);
      })
    );
  }
}
