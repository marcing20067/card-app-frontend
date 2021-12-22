import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/card.model';
import { Set } from 'src/app/shared/models/set.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss'],
})
export class SetsLearnComponent implements OnInit, OnDestroy {
  private updateCardEvent$ = new Subject<unknown>();
  private updateCardSub!: Subscription;
  private newDeactiveCardIndex = 3;
  activateCardIndex = 0;
  learnEnd = false;
  set!: Set;
  cardsWithCurrentGroup!: Card[];
  cardsView!: {
    active: Card;
    deactive: [Card, Card];
  };

  constructor(
    private route: ActivatedRoute,
    private setsService: SetsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.setsService
      .getSet(id)
      .pipe(take(1))
      .subscribe((set) => {
        this.set = set;
        const cardWithSmallestGroup = this.getCardWithSmallestGroup();
        if (cardWithSmallestGroup.group === 6) {
          this.learnEnd = true;
          return;
        }
        this.cardsWithCurrentGroup = this.set.cards.filter(
          (c) => c.group === cardWithSmallestGroup.group
        );

        this.initializeCardsView();
      });

    this.updateCardSub = this.updateCardEvent$
      .pipe(debounceTime(1500))
      .subscribe(() => {
        this.setsService.editSet(this.set).pipe(take(1)).subscribe();
      });
  }

  onLearn(isKnow: boolean) {
    const activeCard = this.cardsView.active;
    const cardIndex = this.set.cards.indexOf(activeCard);

    this.set.cards[cardIndex] = {
      ...activeCard,
      group: isKnow ? activeCard.group + 1 : 1,
    };

    this.updateCardEvent$.next();

    if (this.wasLastCardUsed()) {
      const cardWithSmallestGroup = this.getCardWithSmallestGroup();

      if (cardWithSmallestGroup.group === 6) {
        this.learnEnd = true;
      }

      this.cardsWithCurrentGroup = this.set.cards.filter(
        (c) => c.group === cardWithSmallestGroup.group
      );

      this.resetData();
    }

    if (!this.wasLastCardUsed()) {
      this.cardsView = {
        active: this.cardsView.deactive[0],
        deactive: [
          this.cardsView.deactive[1],
          this.cardsWithCurrentGroup[this.newDeactiveCardIndex],
        ],
      };

      this.activateCardIndex++;
      this.newDeactiveCardIndex++;
    }
  }

  private wasLastCardUsed() {
    return this.activateCardIndex + 1 === this.cardsWithCurrentGroup.length;
  }

  private getCardWithSmallestGroup() {
    const cardWithSmallestGroup = this.set.cards.reduce(
      (prevCard, currentCard) => {
        if (currentCard.group < prevCard.group) {
          return currentCard;
        }
        return prevCard;
      }
    );
    return cardWithSmallestGroup;
  }

  private resetData() {
    this.newDeactiveCardIndex = 3;
    this.activateCardIndex = 0;

    this.initializeCardsView();
  }

  private initializeCardsView() {
    this.cardsView = {
      active: this.cardsWithCurrentGroup[0],
      deactive: [this.cardsWithCurrentGroup[1], this.cardsWithCurrentGroup[2]],
    };
  }

  ngOnDestroy() {
    this.updateCardSub.unsubscribe();
  }
}
