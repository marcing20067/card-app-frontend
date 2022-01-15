import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Set } from 'src/app/shared/models/set/set.model';
import { SetsService } from '../sets.service';
import { SetsCreateFormComponent } from './sets-create-form/sets-create-form.component';

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss'],
})
export class SetsCreateComponent implements OnInit {
  @ViewChildren('createForm')
  formComponentQueryList!: QueryList<SetsCreateFormComponent>;
  isLoading = false;
  mode = '';
  set!: Set;

  constructor(
    private setsService: SetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.isLoading = true;
      this.setsService
        .getSet(id)
        .pipe(take(1))
        .subscribe({
          next: (set) => {
            this.set = set;
            this.mode = 'edit';
            this.isLoading = false;
          },
          error: (res: HttpErrorResponse) => {
            if (res.status === 400) {
              this.router.navigate(['/sets']);
            }
          },
        });
    }

    if (!id) {
      this.mode = 'create';
    }
  }

  onSubmit(set: Set) {
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.set = { ...set, _id: this.set._id };
      this.setsService
        .editSet(this.set)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.router.navigate(['/sets']);
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            if (err.status === 409) {
              this.setNameAlreadyTakenError();
            }
          },
        });
    }

    if (this.mode === 'create') {
      this.set = set;
      this.setsService
        .addSet(this.set)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/sets']);
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            if (err.status === 409) {
              this.setNameAlreadyTakenError();
            }
          },
        });
    }
  }

  private setNameAlreadyTakenError() {
    setTimeout(() => {
      this.formComponentQueryList.first.setNameAlreadyTakenError();
    }, 0);
  }
}
