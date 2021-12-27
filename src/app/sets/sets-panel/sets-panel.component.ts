import { Component, OnInit } from '@angular/core';
import { SetsService } from '../sets.service';
import { Set } from 'src/app/shared/models/set.model';
import { filter, map, take } from 'rxjs/operators';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-sets-panel',
  templateUrl: './sets-panel.component.html',
  styleUrls: ['./sets-panel.component.scss'],
})
export class SetsPanelComponent implements OnInit {
  isLoading = true;
  selectedSet: Set | null = null;
  sets$ = this.setsService.getSetsListener();
  setName!: string;
  
  constructor(
    private setsService: SetsService,
    private popupService: PopupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setName = this.route.snapshot.queryParams.name;
    this.setsService
      .getSets(this.setName)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onDeleteSet(set: Set) {
    this.popupService
      .getConfirmEventListener()
      .pipe(take(1))
      .subscribe((isConfirm) => {
        this.isLoading = true;
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
      isShow: true,
      content: {
        heading: `Czy na pewno chcesz usunąć zestaw "${set.name}"?`,
        text: 'Wybrany zestaw zostanie nieodwracalnie usunięty.',
      },
    });
  }

  onSelectSet(set: Set) {
    this.selectedSet = set;
  }

  onLoadMore() {
    this.isLoading = true;
    this.setsService.loadMore().pipe(take(1)).subscribe(() => {
      this.isLoading = false;
    });
  }
}
