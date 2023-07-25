import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from 'src/app/shared/models/set/card.model';
import { Set } from 'src/app/shared/models/set/set.model';
import { Stats } from 'src/app/shared/models/set/stats.model';

interface CardsState {
  learnedCards: number;
  initialDeckLength: number;
  currentCard: Card | null;
}

@Injectable({
  providedIn: 'root',
})
export class SetsLearnService {
  private cardsState$ = new Subject<CardsState>();
  private deck: Card[] = [];
  private initialDeckLength = 0;
  private learnedCards = 0;
  private lastCardConcept = '';
  private set!: Set;

  getCardsStateListener() {
    return this.cardsState$.asObservable();
  }

  init(set: Set) {
    this.set = set;
    this.deck = this.set.cards.filter((c) => c.group < 6);
    this.initialDeckLength = this.deck.length;

    if (this.deck.length) {
      return this.nextCard();
    }

    this.setCardsState(null);
  }

  onLearn(isKnow: boolean) {
    const prevCard = this.deck[0];
    this.updateStats(isKnow, prevCard.group);
    prevCard.group = isKnow ? prevCard.group + 1 : 1;
    this.nextCard();
  }

  private nextCard() {
    const prevCard = this.deck.shift();
    if (!prevCard) {
      return this.setCardsState(null);
    }

    if (prevCard.group <= 5) {
      this.deck.push(prevCard);
    } else {
      this.learnedCards++;
    }

    if (
      this.deck.length > 2 &&
      (!this.lastCardConcept || prevCard.concept === this.lastCardConcept)
    ) {
      this.shuffleDeck();
    }

    this.setCardsState(this.deck[0]);
  }

  private setCardsState(card: Card | null) {
    this.cardsState$.next({
      learnedCards: this.learnedCards,
      initialDeckLength: this.initialDeckLength,
      currentCard: card,
    });
  }

  private updateStats(isKnow: boolean, oldGroupValue: number) {
    const oldStatsProperty = `group${oldGroupValue}` as keyof Stats;
    this.set.stats[oldStatsProperty]--;
    if (isKnow) {
      const newStatsProperty = `group${oldGroupValue + 1}` as keyof Stats;
      this.set.stats[newStatsProperty]++;
    } else {
      this.set.stats.group1++;
    }
  }

  private shuffleDeck() {
    this.deck = this.shuffle(this.deck);
    const lastCard = this.deck[this.deck.length - 1];
    this.lastCardConcept = lastCard.concept;
  }

  private shuffle(array: any[]) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
