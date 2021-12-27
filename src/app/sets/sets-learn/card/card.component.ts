import { Component, Input } from '@angular/core';
import { Card } from 'src/app/shared/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card!: Card;
  @Input() setName: string = '';
  @Input() isActivate: boolean = false;
  isConceptSide = true;
  onSwitch() {
    this.isConceptSide = !this.isConceptSide;
  }
}
