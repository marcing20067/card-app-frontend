import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { PopupService } from '../services/popup/popup.service';
import { Router } from '@angular/router';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private popupService: PopupService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (err) => {
          if (err.status === 500) {
            this.popupService.display({
              isShow: true,
              content: {
                heading: 'Poliglot - Wewnętrzny błąd serwera',
                text: 'Wystąpił błąd, który nie jest obsługiwany. Proszę spróbować ponownie za jakiś czas. Gdy sytuacja pojawi się ponownie, prosimy o skontaktowanie się na github z twórcą aplikacji.',
              },
              buttons: {
                two: 'Ok',
              },
            });

            this.popupService
              .getConfirmEventListener()
              .pipe(take(1))
              .subscribe(() => {
                this.router.navigate(['/home']);
              });
          }
        },
      })
    );
  }
}
