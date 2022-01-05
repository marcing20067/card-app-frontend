import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Card } from 'src/app/shared/models/set/card.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
  @ViewChildren('activate', { read: ElementRef })
  activateCard!: QueryList<ElementRef>;
  @ViewChild('know') know!: ElementRef;
  @ViewChild('dontKnow') dontKnow!: ElementRef;

  @Input() setName = '';
  @Input() cardsView!: {
    active: Card;
    deactive: [Card, Card];
  };

  @Output() private learnEvent = new EventEmitter<boolean>();

  onLearn(isKnow: boolean) {
    this.learnEvent.emit(isKnow);
  }
}
