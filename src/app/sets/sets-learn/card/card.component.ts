import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from 'src/app/shared/models/set/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card!: Card;
  @Input() setName: string = '';
  @Input() isActivate: boolean = false;
  isConceptSide = true;

  @Output() showInstrucion = new EventEmitter<void>();

  onSwitch() {
    this.isConceptSide = !this.isConceptSide;
  }

  onInstrucionShow() {
    this.showInstrucion.emit();
  }
}
