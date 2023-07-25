import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from 'src/app/shared/models/set/card.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
  @Input() setName = '';
  @Input() card!: Card;

  @Output() private learn = new EventEmitter<boolean>();

  onLearn(isKnow: boolean) {
    this.learn.emit(isKnow);
  }


}
