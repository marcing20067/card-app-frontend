import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { SetsService } from '../sets.service';
import { SetsLearnService } from '../shared/sets-learn.service';
import { Set } from '../shared/models/set.model';
// ADD CREATING RANDOM DECK
@Component({
  selector: 'app-sets-learn',
  templateUrl: './sets-learn.component.html',
  styleUrls: ['./sets-learn.component.scss'],
})
export class SetsLearnComponent implements OnInit, OnDestroy {
  set!: Set;
  cardsState$ = this.setsLearnService.getCardsStateListener();
  private sub!: Subscription;
  private updateCardEvent$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private setsService: SetsService,
    private setsLearnService: SetsLearnService
  ) {}

  onLearn(isKnow: boolean) {
    this.setsLearnService.onLearn(isKnow);
    this.updateCardEvent$.next();
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.setsService
      .getSet(id)
      .pipe(take(1))
      .subscribe((set) => {
        this.set = set;
        this.setsLearnService.init(set);

        this.sub = this.updateCardEvent$
          .pipe(debounceTime(500))
          .subscribe(() => {
            this.setsService.editSet(this.set).pipe(take(1)).subscribe();
          });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
