import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { Stats } from 'src/app/shared/models/set/stats.model';
import { Form } from 'src/app/shared/util/form';

@Component({
  selector: 'app-sets-create-form',
  templateUrl: './sets-create-form.component.html',
  styleUrls: ['./sets-create-form.component.scss'],
})
export class SetsCreateFormComponent extends Form<Set> {
  @ViewChildren('concept', { read: ElementRef }) inputs!: QueryList<ElementRef>;
  @Output() addCard = new EventEmitter<void>();
  @Input() mode!: string;
  @Input() set!: Set;

  constructor() {
    super();
  }

  onAddCard() {
    this.addCard.emit();
  }

  setNameAlreadyTakenError() {
    this.form.get('name')!.setErrors({ alreadytaken: true });
  }

  get cards() {
    interface FormCardsGroup extends Omit<UntypedFormArray, 'controls'> {
      controls: UntypedFormGroup[];
    }

    return this.form.get('cards') as unknown as FormCardsGroup;
  }

  override onSubmit() {
    const newSet: Set = this.form.value;
    const duplicatedCard = this.getDuplicatedCard([...newSet.cards]);
    if (duplicatedCard) {
      // TODO: YOU CAN DO IT WITHOUT QueryList
      const conceptInput = this.getConceptInputByCard(duplicatedCard);
      this.setDuplicateErrorOnControlByCard(duplicatedCard);
      this.scrollToInput(conceptInput);
      return;
    }

    if (this.mode === 'edit') {
      newSet.stats = this.computeStats([...newSet.cards]);
    }

    if (this.mode === 'create') {
      newSet.stats = {
        group1: newSet.cards.length,
        group2: 0,
        group3: 0,
        group4: 0,
        group5: 0,
      };
    }
    this.submitForm.emit(newSet);
  }

  private getDuplicatedCard(cards: Card[]) {
    for (const card of cards) {
      const duplicatedCards = cards.filter((c) => c.concept === card.concept);
      if (duplicatedCards.length >= 2) {
        return card;
      }
    }
    return null;
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
    setTimeout(() => {
      controlsWithDuplicatedValue[lastControlIndex]
        .get('concept')!
        .setErrors({ duplicated: true });
    }, 0);
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
        (oldC: Card) =>
          oldC.concept === c.concept && oldC.definition === c.definition
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
