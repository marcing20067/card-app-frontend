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
  @Input() setName = '';
  @Input() isActivate = false;
  @Output() showInstrucion = new EventEmitter<void>();
  isConceptSide = true;
  private sub!: Subscription;

  constructor(private setsLearnService: SetsLearnService) {}

  onSwitch() {
    this.isConceptSide = !this.isConceptSide;
  }

  onInstrucionShow() {
    this.showInstrucion.emit();
  }
  
  ngOnInit() {
    if (this.isActivate) {
      this.sub = this.setsLearnService.getCardsStateListener().subscribe(() => {
        this.isConceptSide = true;
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
