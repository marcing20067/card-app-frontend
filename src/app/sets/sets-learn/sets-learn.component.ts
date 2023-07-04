import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Set } from 'src/app/shared/models/set/set.model';
import { SetsService } from '../sets.service';
import { CardsState } from '../../shared/models/set/cards-state.model';
import { SetsLearnService } from './services/sets-learn.service';
// ADD CREATING RANDOM DECK
@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss'],
})
export class SetsLearnComponent implements OnInit, OnDestroy {
  private updateCardEvent$ = new Subject<void>();
  learnEnd = false;
  set!: Set;
  sub!: Subscription;
  state!: CardsState;

  constructor(
    private route: ActivatedRoute,
    private setsService: SetsService,
    private setsLearnService: SetsLearnService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.setsService
      .getSet(id)
      .pipe(take(1))
      .subscribe((set) => {
        this.set = set;
        this.setsLearnService
          .getLearnEndListener()
          .pipe(take(1))
          .subscribe(() => {
            this.learnEnd = true;
          });

        this.setsLearnService
          .init(set)
          .pipe(take(1))
          .subscribe((state) => {
            if (state) {
              this.state = state;
            }
          });

        this.sub = this.updateCardEvent$
          .pipe(debounceTime(500))
          .subscribe(() => {
            this.setsService.editSet(this.set).pipe(take(1)).subscribe();
          });
      });
  }

  onLearn(isKnow: boolean) {
    const activeCard = this.state.cardsView.active;
    this.setsLearnService.onLearn(isKnow, activeCard);
    this.updateCardEvent$.next();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
