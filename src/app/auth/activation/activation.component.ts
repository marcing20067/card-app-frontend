import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],
})
export class ActivationComponent implements OnInit {
  isLoading = true;
  isActivationFailed = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const activationToken = this.route.snapshot.params.activationToken;
    this.authService
      .activation(activationToken)
      .pipe(take(1))
      .subscribe({
        error: () => {
          this.isLoading = false;
          this.isActivationFailed = true;
        },
      });
  }
}
