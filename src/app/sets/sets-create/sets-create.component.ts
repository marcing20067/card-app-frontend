import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss'],
})
export class SetsCreateComponent implements OnInit {
  form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    cards: this.fb.array([]),
  });
  id = '';
  isLoading = false;
  mode = '';
  set!: Set;

  constructor(
    private setsService: SetsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.isLoading = true;
      this.setsService
        .getSet(this.id)
        .pipe(take(1))
        .subscribe({
          next: (set) => {
            this.set = set;
            this.mode = 'edit';
            this.setCardsOnForm(set);
            this.form.get('name')?.setValue(set.name);
            this.isLoading = false;
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
      this.mode = 'create';
    }
  }

  private setCardsOnForm(set: Set) {
    const cards = set.cards;
    for (const card of cards) {
      this.addCardToForm(card);
    }
  }

  addCardToForm(card?: Card) {
    const newCard = this.createCardGroup(card);
    (this.form.get('cards')! as UntypedFormArray).push(newCard);
  }

  private createCardGroup(card?: Card) {
    const cardGroup = this.fb.group({
      concept: [card?.concept, [Validators.required, Validators.maxLength(50)]],
      definition: [
        card?.definition,
        [Validators.required, Validators.maxLength(100)],
      ],
      example: [card?.example, [Validators.maxLength(100)]],
      group: card?.group || 1,
    });
    return cardGroup;
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

  private setNameAlreadyTakenError() {
    setTimeout(() => {
      this.form.get('name')!.setErrors({ alreadytaken: true });
    }, 0);
  }
}
