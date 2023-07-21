import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { SetsService } from '../sets.service';
import { SetsForm } from './sets-form';
import { SetCardForm } from './set-card-form';

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss'],
})
export class SetsCreateComponent implements OnInit {
  form: FormGroup<SetsForm> = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    cards: this.fb.nonNullable.array<FormGroup<SetCardForm>>([]),
  });
  id = '';
  isLoading = false;
  mode = '';
  set!: Set;

  constructor(
    private setsService: SetsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.mode = this.id ? 'edit' : 'create';
    if (this.id) {
      this.isLoading = true;
      this.setsService
        .getSet(this.id)
        .pipe(take(1))
        .subscribe({
          next: (set) => {
            this.set = set;
            this.isLoading = false;
            this.setFormValue();
          },
          error: (res: HttpErrorResponse) => {
            if (res.status === 400) {
              this.router.navigate(['/sets']);
            }
          },
        });
    }

    if (!this.id) {
      this.addCardToForm();
    }
  }

  addCardToForm(card?: Card) {
    const newCard = this.createCardGroup(card);
    this.form.controls.cards.push(newCard);
  }

  onSubmit(set: Set) {
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.setsService
        .editSet({ ...set, _id: this.id })
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
      this.setsService
        .addSet(set)
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

  private setFormValue() {
    this.form.controls.name.setValue(this.set.name);
    this.setCardsOnForm();
  }

  private setCardsOnForm() {
    const cards = this.set.cards;
    for (const card of cards) {
      this.addCardToForm(card);
    }
  }

  private createCardGroup(card?: Card) {
    const cardGroup: FormGroup<SetCardForm> = this.fb.nonNullable.group({
      concept: [
        card?.concept || '',
        [Validators.required, Validators.maxLength(50)],
      ],
      definition: [
        card?.definition || '',
        [Validators.required, Validators.maxLength(100)],
      ],
      example: this.fb.control(card?.example || null, [
        Validators.maxLength(100),
      ]),
      group: card?.group || 1,
    });
    return cardGroup;
  }

  private setNameAlreadyTakenError() {
    setTimeout(() => {
      this.form.controls.name.setErrors({ alreadyTaken: true });
    }, 0);
  }
}
