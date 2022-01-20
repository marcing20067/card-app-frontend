import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Set } from 'src/app/shared/models/set/set.model';
import { SetsService } from '../sets.service';
import { CardsState } from '../../shared/models/set/cards-state.model';
import { SetsLearnService } from './services/sets-learn.service';

@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss'],
})
export class SetsLearnComponent implements OnInit, OnDestroy {
  private updateCardEvent$ = new Subject<void>();
  learnEnd = false;
  set!: Set;
  subs: Subscription[] = [];
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
        const learnEndSub = this.setsLearnService
          .getLearnEndListener()
          .subscribe(() => {
            this.learnEnd = true;
          });

        const stateListener = this.setsLearnService
          .init(set)
          .subscribe((state) => {
            if (state) {
              this.state = state;
            }
          });

        const updateCardSub = this.updateCardEvent$
          .pipe(debounceTime(500))
          .subscribe(() => {
            this.setsService.editSet(this.set).pipe(take(1)).subscribe();
          });

        this.subs = [stateListener, learnEndSub, updateCardSub];
      });
  }

  onLearn(isKnow: boolean) {
    const activeCard = this.state.cardsView.active;
    this.setsLearnService.onLearn(isKnow, activeCard);
    this.updateCardEvent$.next();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
