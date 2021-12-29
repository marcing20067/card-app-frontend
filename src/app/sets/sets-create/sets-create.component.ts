import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/card.model';
import { Set } from 'src/app/shared/models/set.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss'],
})
export class SetsCreateComponent implements OnInit {
  @ViewChildren('concept', { read: ElementRef }) inputs!: QueryList<ElementRef>;
  setsCreateForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    cards: this.fb.array([]),
  });
  isLoading = false;
  mode = '';
  oldSet!: Set;

  constructor(
    private fb: FormBuilder,
    private setsService: SetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.isLoading = true;
      this.setsService
        .getSet(id)
        .pipe(take(1))
        .subscribe({
          next: (set) => {
            this.oldSet = set;
            for (let i = 0; i < set.cards.length; i++) {
              this.addCard();
            }

            this.setsCreateForm.patchValue({
              name: set.name,
              cards: set.cards,
            });
            this.mode = 'edit';
            this.isLoading = false;
          },
          error: (res: HttpErrorResponse) => {
            if (res.status === 400) {
              this.router.navigate(['/sets']);
            }
          },
        });
    } else {
      this.mode = 'create';
      this.addCard();
    }
  }

  addCard() {
    const newCardGroup = this.fb.group({
      concept: ['', [Validators.required, Validators.maxLength(50)]],
      definition: ['', [Validators.required, Validators.maxLength(100)]],
      example: [null, [Validators.maxLength(100)]],
      group: 1,
    });

    this.cards.push(newCardGroup);
  }

  get cards() {
    interface Cards extends Omit<FormArray, 'controls'> {
      controls: FormGroup[];
    }

    return this.setsCreateForm.get('cards') as unknown as Cards;
  }

  onSubmit() {
    const newSet: Set = this.setsCreateForm.value;

    const isDuplicates = this.checkDuplicates([...newSet.cards]);
    if (isDuplicates) {
      return;
    }

    this.isLoading = true;
    if (this.oldSet) {
      newSet.stats = this.computeStats([...newSet.cards]);

      this.setsService
        .editSet({ ...newSet, _id: this.oldSet._id })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.router.navigate(['/sets']);
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            if (err.status === 409) {
              this.isLoading = false;
              setTimeout(() => {
                // Waiting for end *ngIf works
                this.setsCreateForm
                  .get('name')
                  ?.setErrors({ alreadytaken: true });
              }, 0);
            }
          },
        });
    }
    if (!this.oldSet) {
      newSet.stats = {
        group1: newSet.cards.length,
        group2: 0,
        group3: 0,
        group4: 0,
        group5: 0,
      };
      this.setsService
        .addSet(newSet)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/sets']);
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 409) {
              this.isLoading = false;
              setTimeout(() => {
                // Waiting for end *ngIf works
                this.setsCreateForm
                  .get('name')
                  ?.setErrors({ alreadytaken: true });
              }, 0);
            }
          },
        });
    }
  }

  private checkDuplicates(cards: Card[]): boolean {
    let isDuplicate = false;
    cards.forEach((el, i) => {
      const duplicatedCards = cards.filter((c) => c.concept === el.concept);
      if (duplicatedCards.length >= 2) {
        isDuplicate = true;
        cards.length = i + 1;
      }
    });

    if (isDuplicate) {
      const duplicatedCard = cards[cards.length - 1];
      const duplicateConcept = duplicatedCard.concept;
      const duplicatedInputs = this.inputs
        .toArray()
        .filter((i) => i.nativeElement.value === duplicateConcept);
      const duplicatedInput = duplicatedInputs[0].nativeElement;

      const scrollMargin = 150;
      window.scrollTo(
        0,
        window.scrollY +
          duplicatedInput.getBoundingClientRect().top -
          scrollMargin
      );

      const controlsWithDuplicatedValue = this.cards.controls.filter(
        (c) => c.value.concept === duplicateConcept
      );
      controlsWithDuplicatedValue[0]
        .get('concept')
        ?.setErrors({ duplicated: 'concept' });
    }
    return isDuplicate;
  }

  private computeStats(cards: Card[]): Set['stats'] {
    const stats = {
      group1: 0,
      group2: 0,
      group3: 0,
      group4: 0,
      group5: 0,
    };

    cards.forEach((newEl) => {
      const notChangedElIndex = this.oldSet.cards.findIndex((el) => {
        return (
          el.concept === newEl.concept && el.definition === newEl.definition
        );
      });

      if (notChangedElIndex >= 0) {
        const notChangedEl = this.oldSet.cards[notChangedElIndex] as Card;
        const elGroupFullName = ('group' +
          notChangedEl.group) as keyof Set['stats'];
        stats[elGroupFullName] = stats[elGroupFullName] + 1;
      } else {
        newEl.group = 1;
        stats.group1++;
      }
    });
    return stats;
  }
}
