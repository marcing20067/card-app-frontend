import { Component, Inject, OnInit } from '@angular/core';
import { SetsService } from '../sets.service';
import { take } from 'rxjs/operators';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { ActivatedRoute } from '@angular/router';
import { TabulationService } from 'src/app/shared/services/tabulation/tabulation.service';
import { GLOBAL_ELEMENTS } from 'src/app/shared/util/global-elements';
import { Set } from '../shared/models/set.model';
@Component({
  selector: 'app-sets-panel',
  templateUrl: './sets-panel.component.html',
  styleUrls: ['./sets-panel.component.scss'],
  providers: [GLOBAL_ELEMENTS]
})
export class SetsPanelComponent implements OnInit {
  isLoading = true;
  selectedSet: Set | null = null;
  sets$ = this.setsService.getSetsListener();
  nameFilter = this.route.snapshot.queryParams.name;


  constructor(
    private setsService: SetsService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private tabulationService: TabulationService,
    @Inject('popup') private popupEl: HTMLElement
    ) {}

  onDeleteSet(set: Set) {
    this.popupService
      .getConfirmEventListener()
      .pipe(take(1))
      .subscribe((isConfirm) => {
        this.isLoading = isConfirm;
        if (isConfirm) {
          this.setsService
            .deleteSet(set._id as string)
            .pipe(take(1))
            .subscribe(() => {
              this.isLoading = false;
            });
        }
      });

    this.popupService.display({
      content: {
        heading: `Czy na pewno chcesz usunąć zestaw "${set.name}"?`,
        text: 'Wybrany zestaw zostanie nieodwracalnie usunięty.',
      },
    });
    this.tabulationService.trapTabulation(this.popupEl);
  }

  onSelectSet(set: Set) {
    this.selectedSet = set;
  }

  onLoadMore() {
    this.isLoading = true;
    this.setsService
      .loadMore(this.nameFilter)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.setsService
      .getSets(this.nameFilter)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
