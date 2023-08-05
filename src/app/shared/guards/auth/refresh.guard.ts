import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { TokenService } from '../../services/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class RefreshGuard {
  constructor(private tokenService: TokenService) {}
  canLoad() {
    return this.tokenService.getIsRefreshCalledListener().pipe(
      take(1),
      switchMap((isCalled) => {
        if (!isCalled) {
          return this.tokenService.refresh().pipe(
            take(1),
            switchMap(() => {
              return of(true);
            })
          );
        }
        return of(true);
      }),
      catchError(() => {
        return of(true);
      })
    );
  }
}
