import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { Stats } from 'src/app/shared/models/set/stats.model';
import { SetsForm } from '../sets-form';

@Component({
  selector: 'app-sets-create-form',
  templateUrl: './sets-create-form.component.html',
  styleUrls: ['./sets-create-form.component.scss'],
})
export class SetsCreateFormComponent {
  @ViewChildren('concept', { read: ElementRef }) inputs!: QueryList<ElementRef>;
  @Output() addCard = new EventEmitter<void>();
  @Input() mode!: string;
  @Input() set!: Set;
  @Input() form!: FormGroup<SetsForm>;
  @Output() submitForm = new EventEmitter<Set>();

  onAddCard() {
    this.addCard.emit();
  }

  setNameAlreadyTakenError() {
    this.form.controls.name.setErrors({ alreadyTaken: true });
  }

  get cards() {
    return this.form.controls.cards;
  }

  onSubmit() {
    const value = this.form.getRawValue();
    const duplicatedCardIndex = this.getDuplicatedCardIndex([...value.cards]);
    let set: Set;
    if (duplicatedCardIndex >= 0) {
      const input = this.getInput(duplicatedCardIndex);
      const control = this.getControl(duplicatedCardIndex);
      this.setDuplicateError(control);
      this.scrollToInput(input);
      return;
    }

    if (this.mode === 'edit') {
      const stats = this.computeStats([...value.cards]);
      set = { ...value, stats, creator: this.set.creator };
    }

    if (this.mode === 'create') {
      const stats = {
        group1: value.cards.length,
        group2: 0,
        group3: 0,
        group4: 0,
        group5: 0,
      };
      set = { ...value, stats };
    }
    this.submitForm.emit(set!);
  }

  private getDuplicatedCardIndex(cards: Card[]) {
    return cards.findIndex((card) => {
      const duplicates = cards.filter((c) => c.concept === card.concept);
      return duplicates.length >= 2;
    });
  }
  private getInput(index: number) {
    return this.inputs.toArray()[index].nativeElement;
  }

  private getControl(index: number) {
    return this.cards.controls[index].controls.concept;
  }

  private setDuplicateError(control: AbstractControl) {
    setTimeout(() => {
      control.setErrors({ duplicated: true });
    }, 0);
  }

  private scrollToInput(input: HTMLElement) {
    const scrollMargin = 150;
    window.scrollTo(
      0,
      window.scrollY + input.getBoundingClientRect().top - scrollMargin
    );
  }

  private computeStats(newCards: Card[]) {
    const stats = {
      group1: 0,
      group2: 0,
      group3: 0,
      group4: 0,
      group5: 0,
    };

    const oldCards = this.set.cards;
    for (const newCard of newCards) {
      const unChangedCardIndex = oldCards.findIndex((oldCard: Card) => {
        return (
          oldCard.concept === newCard.concept &&
          oldCard.definition === newCard.definition
        );
      });

      if (unChangedCardIndex < 0) {
        newCard.group = 1;
        stats.group1++;
        continue;
      }

      const unChangedCard = this.set.cards[unChangedCardIndex];
      const statsProperty = `group${unChangedCard.group}` as keyof Stats;
      stats[statsProperty] = stats[statsProperty] + 1;
    }

    return stats;
  }
}
