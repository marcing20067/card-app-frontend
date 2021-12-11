import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/card.model';
import { Set } from 'src/app/shared/models/set.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss'],
})
export class SetsCreateComponent {
  oldSet!: Set;
  setName: string = '';
  setsCreateForm = this.fb.group({
    name: ['', Validators.required],
    cards: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private setsService: SetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.setsService
        .getSet(id)
        .pipe(take(1))
        .subscribe({
          next: (set) => {
            this.oldSet = set;
            this.setName = set.name;
            for (let i = 0; i < set.cards.length; i++) {
              this.addCard();
            }

            this.setsCreateForm.patchValue({
              name: set.name,
              cards: set.cards,
            });
          },
          error: (res: HttpErrorResponse) => {
            if (res.status === 400) {
              this.router.navigate(['/sets']);
            }
          },
        });
    } else {
      this.addCard();
      this.setName = 'edit';
    }
  }

  addCard() {
    const newCardGroup = this.fb.group({
      concept: ['', Validators.required],
      definition: ['', Validators.required],
      group: [1, Validators.required],
      example: [''],
    });

    this.cards.push(newCardGroup);
  }

  get cards() {
    return this.setsCreateForm.get('cards') as FormArray;
  }

  onSubmit() {
    const newSet: Set = this.setsCreateForm.value;
    if(this.oldSet) {
      newSet.stats = {
        group1: 0,
        group2: 0,
        group3: 0,
        group4: 0,
        group5: 0,
      };
      newSet.cards.forEach((newEl => {
        const notChangedElIndex = this.oldSet.cards.indexOf(newEl);
        if(notChangedElIndex > 0) {
          const notChangedEl = this.oldSet.cards[notChangedElIndex] as Card;
          const elGroupFullName = 'group' + notChangedEl.group as keyof Set["stats"];
          newSet.stats[elGroupFullName] = newSet.stats[elGroupFullName] + 1;
        } else {
          newSet.stats.group1++;
        }
      }))
    }
    if (!this.oldSet) {
      newSet.stats = {
        group1: newSet.cards.length,
        group2: 0,
        group3: 0,
        group4: 0,
        group5: 0,
      };
      this.setsService.addSet(newSet).subscribe();
    }
  }
}
