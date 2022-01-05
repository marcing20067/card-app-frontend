import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { Stats } from 'src/app/shared/models/set/stats.model';
import { SetsService } from '../sets.service';

@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss'],
})
export class SetsLearnComponent implements OnInit, OnDestroy {
  private updateCardEvent$ = new Subject<unknown>();
  private updateCardSub!: Subscription;
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
        this.cardsWithCurrentGroup = this.getCardsByGroup(cardWithSmallestGroup.group);

        this.initializeCardsView();
      });

    this.updateCardSub = this.updateCardEvent$
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.setsService.editSet(this.set).pipe(take(1)).subscribe();
      });
  }

  private getCardsByGroup(group: number) {
    return this.set.cards.filter((c) => c.group === group);
  }

  onLearn(isKnow: boolean) {
    const activeCard = this.cardsView.active;
    const cardIndex = this.set.cards.indexOf(activeCard);

    this.set.cards[cardIndex] = {
      ...activeCard,
      group: isKnow ? activeCard.group + 1 : 1,
    };

    const oldGroup = `group${activeCard.group}` as keyof Stats;
    if (isKnow) {
      const newGroup = `group${activeCard.group + 1}` as keyof Stats;
      this.set.stats[oldGroup] = this.set.stats[oldGroup] - 1;
      this.set.stats[newGroup] = this.set.stats[newGroup] + 1;
    } else {
      this.set.stats.group1 = this.set.stats.group1 + 1;
      this.set.stats[oldGroup] = this.set.stats[oldGroup] - 1;
    }

    this.updateCardEvent$.next();

    if (this.wasLastCardUsed()) {
      const cardWithSmallestGroup = this.getCardWithSmallestGroup();

      if (cardWithSmallestGroup.group > 5) {
        this.learnEnd = true;
      }

      this.cardsWithCurrentGroup = this.getCardsByGroup(cardWithSmallestGroup.group);
      this.resetData();
      return;
    }

    this.nextCard();
    this.activateCardIndex++;
  }

  private wasLastCardUsed() {
    return this.activateCardIndex + 1 === this.cardsWithCurrentGroup.length;
  }

  private nextCard() {
    this.cardsView = {
      active: this.cardsView.deactive[0],
      deactive: [
        this.cardsView.deactive[1],
        this.cardsWithCurrentGroup[this.activateCardIndex + 3],
      ],
    };
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
