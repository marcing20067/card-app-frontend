import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap({
        error: (err) => {
          if (err.status === 500) {
            setTimeout(() => {
              this.router.navigate(['/server-error']);
            }, 0);
          }
        },
      })
    );
  }
}
