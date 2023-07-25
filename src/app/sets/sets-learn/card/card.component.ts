import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Card } from 'src/app/shared/models/set/card.model';
import { SetsLearnService } from '../services/sets-learn.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() card?: Card;
  @Input() setName: string = '';
  @Input() isActivate: boolean = false;
  isConceptSide = true;
  private sub!: Subscription;

  @Output() showInstrucion = new EventEmitter<void>();

  constructor(private setsLearnService: SetsLearnService) {}

  ngOnInit() {
    if (this.isActivate) {
      this.sub = this.setsLearnService.getCardsStateListener().subscribe(() => {
        this.isConceptSide = true;
      });
    }
  }

  onSwitch() {
    this.isConceptSide = !this.isConceptSide;
  }

  onInstrucionShow() {
    this.showInstrucion.emit();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
