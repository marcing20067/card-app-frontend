import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  mode = '';
  resetForm!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.url[1].path;
    if (this.mode === 'username') {
      this.resetForm = this.fb.group({
        newUsername: this.fb.control('', Validators.required),
      });
    }

    if (this.mode === 'password') {
      this.resetForm = this.fb.group({
        newPassword: this.fb.control('', Validators.required),
        repeatNewPassword: this.fb.control('', Validators.required),
      });
    }
  }

  onSubmit() {
    const token = this.route.snapshot.params.token as string;
    const mode = this.mode as 'username' | 'password';
    this.authService
      .resetWithToken(mode, token, this.resetForm.value)
      .subscribe();
  }
}
