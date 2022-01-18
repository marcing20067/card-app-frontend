import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { Stats } from 'src/app/shared/models/set/stats.model';

@Component({
  selector: 'app-sets-create-form',
  templateUrl: './sets-create-form.component.html',
  styleUrls: ['./sets-create-form.component.scss'],
})
export class SetsCreateFormComponent implements OnInit {
  @ViewChildren('concept', { read: ElementRef }) inputs!: QueryList<ElementRef>;
  setsCreateForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    cards: this.fb.array([]),
  });

  @Input() set!: Set;
  @Input() mode!: string;
  @Output() submit = new EventEmitter<Set>();

  constructor(private fb: FormBuilder) {}

  setNameAlreadyTakenError() {
    this.setsCreateForm.get('name')?.setErrors({ alreadytaken: true });
  }

  ngOnInit() {
    if (this.set) {
      this.setValuesOnForm();
      return;
    }
    this.addCard();
  }

  addCard() {
    const newCard = this.fb.group({
      concept: ['', [Validators.required, Validators.maxLength(50)]],
      definition: ['', [Validators.required, Validators.maxLength(100)]],
      example: [null, [Validators.maxLength(100)]],
      group: 1,
    });

    this.cards.push(newCard);
  }

  private setValuesOnForm() {
    for (let i = 0; i < this.set.cards.length; i++) {
      this.addCard();
    }

    this.setsCreateForm.patchValue({
      name: this.set.name,
      cards: this.set.cards,
    });
  }

  get cards() {
    interface FormCardsGroup extends Omit<FormArray, 'controls'> {
      controls: FormGroup[];
    }

    return this.setsCreateForm.get('cards') as unknown as FormCardsGroup;
  }

  onSubmit() {
    const newSet: Set = this.setsCreateForm.value;
    const duplicatedCard = this.getDuplicatedCard([...newSet.cards]);
    if (duplicatedCard) {
      const conceptInput = this.getConceptInputByCard(duplicatedCard);
      this.setDuplicateErrorOnControlByCard(duplicatedCard);
      this.scrollToInput(conceptInput);
      return;
    }

    if (this.set) {
      newSet.stats = this.computeStats([...newSet.cards]);
    }

    if (!this.set) {
      newSet.stats = {
        group1: newSet.cards.length,
        group2: 0,
        group3: 0,
        group4: 0,
        group5: 0,
      };
    }

    this.submit.emit(newSet);
  }

  private getDuplicatedCard(cards: Card[]) {
    let duplicatedCard!: Card;
    cards.forEach((el, i) => {
      const duplicatedCards = cards.filter((c) => c.concept === el.concept);
      if (duplicatedCards.length >= 2) {
        duplicatedCard = el;
        cards.length = i + 1;
      }
    });
    return duplicatedCard;
  }

  private getConceptInputByCard(card: Card) {
    const duplicatedInputs = this.inputs
      .toArray()
      .filter((i) => i.nativeElement.value === card.concept);
    const lastDuplicatedInputIndex = duplicatedInputs.length - 1;
    const duplicatedInput =
      duplicatedInputs[lastDuplicatedInputIndex].nativeElement;
    return duplicatedInput;
  }

  private setDuplicateErrorOnControlByCard(card: Card) {
    const controlsWithDuplicatedValue = this.cards.controls.filter(
      (c) => c.value.concept === card.concept
    );
    const lastControlIndex = controlsWithDuplicatedValue.length - 1;
    controlsWithDuplicatedValue[lastControlIndex]
      .get('concept')
      ?.setErrors({ duplicated: true });
  }

  private scrollToInput(input: HTMLElement) {
    const scrollMargin = 150;
    window.scrollTo(
      0,
      window.scrollY + input.getBoundingClientRect().top - scrollMargin
    );
  }

  private computeStats(cards: Card[]) {
    const stats = {
      group1: 0,
      group2: 0,
      group3: 0,
      group4: 0,
      group5: 0,
    };

    cards.forEach((c) => {
      const notChangedElIndex = this.set.cards.findIndex(
        (oldC) => oldC.concept === c.concept && oldC.definition === c.definition
      );

      if (notChangedElIndex >= 0) {
        const notChangedEl = this.set.cards[notChangedElIndex];
        const elGroupFullName = `group${notChangedEl.group}` as keyof Stats;
        stats[elGroupFullName] = stats[elGroupFullName] + 1;
      } else {
        c.group = 1;
        stats.group1++;
      }
    });
    return stats;
  }
}
