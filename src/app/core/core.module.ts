import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { CoreComponent } from './core.component';
import { LayoutModule } from '../layout/layout.module';
import { ServerErrorInterceptor } from '../shared/interceptors/server-error.interceptor';

@NgModule({
  declarations: [CoreComponent],
  imports: [CommonModule, HttpClientModule, LayoutModule],
  exports: [CoreComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
