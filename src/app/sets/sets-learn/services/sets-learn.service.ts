import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { Stats } from 'src/app/shared/models/set/stats.model';
import { CardsState } from '../../../shared/models/set/cards-state.model';
import { CardsViewService } from './cards-view.service';

@Injectable({
  providedIn: 'root',
})
export class SetsLearnService {
  private set!: Set;
  private cardsWithCurrentGroup!: Card[];
  private learnEnd$ = new Subject<void>();
  private cardIndex = 1;

  constructor(private cardsViewService: CardsViewService) {}

  getLearnEndListener() {
    return this.learnEnd$.asObservable();
  }

  init(set: Set): Observable<CardsState | null> {
    this.set = set;
    this.cardIndex = 1;

    const cardWithSmallestGroup = this.getCardWithSmallestGroup();
    if (cardWithSmallestGroup.group === 6) {
      this.learnEnd$.next();
    }

    this.cardsWithCurrentGroup = this.getCardsByGroup(
      cardWithSmallestGroup.group
    );

    this.cardsViewService.wasLastCardUsed().subscribe(() => {
      const cardWithSmallestGroup = this.getCardWithSmallestGroup();
      if (cardWithSmallestGroup.group > 5) {
        this.learnEnd$.next();
        return;
      }

      this.cardsWithCurrentGroup = this.getCardsByGroup(
        cardWithSmallestGroup.group
      );
      this.cardIndex = 1;
      this.cardsViewService.resetView(this.cardsWithCurrentGroup);
    });

    const stateListener$ = this.cardsViewService.getCardsViewListener().pipe(
      switchMap((cardsView) => {
        if (cardsView) {
          return of({
            cardsView: cardsView,
            cardIndex: this.cardIndex,
            cardsLength: this.cardsWithCurrentGroup.length,
          });
        }
        return of(null);
      })
    );
    this.cardsViewService.initView(this.cardsWithCurrentGroup);
    return stateListener$;
  }

  private getCardsByGroup(group: number) {
    return this.set.cards.filter((c) => c.group === group);
  }

  onLearn(isKnow: boolean, card: Card) {
    const cardIndex = this.set.cards.indexOf(card);
    this.cardIndex++;
    this.set.cards[cardIndex] = {
      ...card,
      group: isKnow ? card.group + 1 : 1,
    };

    this.updateGroupInStats(isKnow, card.group);
    this.cardsViewService.nextCard();
  }

  private updateGroupInStats(isKnow: boolean, oldGroupNum: number) {
    const oldGroup = `group${oldGroupNum}` as keyof Stats;
    if (isKnow) {
      const newGroup = `group${oldGroupNum + 1}` as keyof Stats;
      this.set.stats[oldGroup] = this.set.stats[oldGroup] - 1;
      this.set.stats[newGroup] = this.set.stats[newGroup] + 1;
    } else {
      this.set.stats.group1 = this.set.stats.group1 + 1;
      this.set.stats[oldGroup] = this.set.stats[oldGroup] - 1;
    }
  }

  private getCardWithSmallestGroup() {
    return this.set.cards.reduce((prevCard, currentCard) => {
      if (currentCard.group < prevCard.group) {
        return currentCard;
      }
      return prevCard;
    });
  }
}
