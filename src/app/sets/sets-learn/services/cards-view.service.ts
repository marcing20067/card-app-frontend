import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Card } from '../../../shared/models/set/card.model';
import { CardsView } from './cards-view.model';

@Injectable({
  providedIn: 'root',
})
export class CardsViewService {
  private cardsView!: CardsView;
  private cardsView$ = new BehaviorSubject<CardsView | null>(null);
  private wasLastCardUsed$ = new Subject<void>();
  private activateCardIndex!: number;
  private cards!: Card[];

  constructor() {}

  getCardsViewListener() {
    return this.cardsView$.asObservable();
  }

  wasLastCardUsed() {
    return this.wasLastCardUsed$.asObservable();
  }

  initView(cards: Card[]) {
    this.activateCardIndex = 0;
    this.cards = cards;
    this.cardsView = {
      active: this.cards[0],
      deactive: [this.cards[1], this.cards[2]],
    };
    this.cardsView$.next(this.cardsView);
  }

  nextCard() {
    this.activateCardIndex++;

    const newActiveCard = this.cardsView.deactive[0];
    if (!newActiveCard) {
      this.wasLastCardUsed$.next();
      return;
    }

    this.cardsView = {
      active: this.cardsView.deactive[0],
      deactive: [
        this.cardsView.deactive[1],
        this.cards[this.activateCardIndex + 2],
      ],
    };
    this.cardsView$.next(this.cardsView);
  }

  resetView(cards: Card[]) {
    this.activateCardIndex = 0;
    this.initView(cards);
    this.cardsView$.next(this.cardsView);
  }
}
