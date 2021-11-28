import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { TokenService } from '../shared/services/token.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.tokenService.isAuth().pipe(
      switchMap((isTokenValid) => {
        console.log(isTokenValid);
        if (!isTokenValid) {
          return next.handle(req);
        }

        const accessToken = this.tokenService.getAccessToken();
        const authReq = req.clone({
          headers: req.headers.set('X-Access-Token', `${accessToken}`),
        });

        return next.handle(authReq);
      })
    );
  }
}
