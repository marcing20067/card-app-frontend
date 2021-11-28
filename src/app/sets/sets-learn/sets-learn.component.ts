import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/card.model';
import { Set } from 'src/app/shared/models/set.model';
import { SetsService } from '../sets.service';

interface TouchEvent {
  changedTouches: [
    {
      identifier: number;
      target: HTMLElement;
      screenX: number;
      screenY: number;
      clientX: number;
      clientY: number;
    }
  ];
  view: Window;
}

@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss'],
})
export class SetsLearnComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('activate', { read: ElementRef })
  activateCard!: QueryList<ElementRef>;
  @ViewChild('know') know!: ElementRef;
  @ViewChild('dontKnow') dontKnow!: ElementRef;

  set!: Set;
  cardsWithCurrentGroup!: Card[];
  cardsView!: {
    active: Card;
    deactive: [Card, Card];
  };

  activateCardIndex = 0;
  newDeactiveCardIndex = 3;

  cardListenerSubs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private setsService: SetsService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.setsService
      .getSet(id)
      .pipe(take(1))
      .subscribe((set) => {
        this.set = set;
        this.cardsWithCurrentGroup = this.set.cards.filter(
          (c) => c.group === 1
        );

        this.initializeCardsView();
      });
  }

  ngAfterViewInit() {
    this.activateCard.changes.pipe(take(1)).subscribe(() => {
      const card = this.activateCard.first.nativeElement as HTMLElement;

      const touchEndSub = fromEvent<TouchEvent>(card, 'touchend').subscribe(
        (event) => {
          const isKnow = this.isKnow(card);
          
          if (isKnow === null) {
            return;
          }
          this.renderer.setStyle(card, 'left', window.innerWidth / 2 + 'px');
          this.learn(isKnow);
        }
      );

      const touchMoveSub = fromEvent<TouchEvent>(card, 'touchmove', {
        passive: true,
      }).subscribe((event) => {
        const clientX = event.changedTouches[0].clientX;
        this.renderer.setStyle(card, 'left', clientX + 'px');
      });

      this.cardListenerSubs.push(touchMoveSub);
      this.cardListenerSubs.push(touchEndSub);
    });
  }

  private isKnow(card: HTMLElement): boolean | null {
    const knowEl = this.know.nativeElement;
    const dontKnowEl = this.dontKnow.nativeElement;
    const selectErrorMarginPx = 50;

    const isLeftSide =
      card.getBoundingClientRect().left <
      dontKnowEl.getBoundingClientRect().right + selectErrorMarginPx;

    const isRightSide =
      card.getBoundingClientRect().right + selectErrorMarginPx >
      knowEl.getBoundingClientRect().left;

    if (isLeftSide) {
      return false;
    }

    if (isRightSide) {
      return true;
    }

    return null;
  }

  private learn(isKnow: boolean) {
    const activeCard = this.cardsView.active;
    const cardIndex = this.set.cards.indexOf(activeCard);

    this.set.cards[cardIndex] = {
      ...activeCard,
      group: isKnow ? activeCard.group + 1 : 1,
    };

    if (this.wasLastCardUsed()) {
      const cardWithSmallestGroup = this.getCardWithSmallestGroup();

      this.cardsWithCurrentGroup = this.set.cards.filter(
        (c) => c.group === cardWithSmallestGroup.group
      );

      this.resetData();
      return;
    }

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
    this.cardListenerSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
