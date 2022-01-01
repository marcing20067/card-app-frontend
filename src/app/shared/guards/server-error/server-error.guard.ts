import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { ServerErrorService } from 'src/app/shared/services/server-error/server-error.service';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorGuard implements CanLoad {
  constructor(private serverErrorService: ServerErrorService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.serverErrorService.getIsServerErrorListener().pipe(
      take(1),
      tap((isServerError) => {
        console.log(isServerError);
        if (isServerError) {
          this.router.navigate(['/server-error']);
          this.serverErrorService.changeIsServerError(false);
        }
      }),
      switchMap((isServerError) => {
        return of(!isServerError);
      })
    );
  }
}
