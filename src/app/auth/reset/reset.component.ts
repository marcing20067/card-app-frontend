import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ResetUsernameFormComponent } from './reset-username-form/reset-username-form.component';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit, OnDestroy {
  @ViewChildren('resetUsername')
  resetUsernameForm!: QueryList<ResetUsernameFormComponent>;

  private formSub!: Subscription;
  mode!: string;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.mode = this.route.snapshot.url[1].path;
  }

  onSubmit(data: any) {
    this.isLoading = true;
    const token = this.route.snapshot.params.token as string;
    const mode = this.mode as 'username' | 'password';
    this.authService
      .resetWithToken(mode, token, data)
      .pipe(take(1))
      .subscribe({
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 409) {
            setTimeout(() => {
              this.resetUsernameForm.first.setAlreadyTakenErrorOnUsername();
            }, 0);
          }
        },
      });
  }

  ngOnDestroy() {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}
