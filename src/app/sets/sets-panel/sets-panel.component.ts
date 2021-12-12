import { Component, OnInit } from '@angular/core';
import { SetsService } from '../sets.service';
import { Set } from 'src/app/shared/models/set.model';
import { map, take } from 'rxjs/operators';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
@Component({
  selector: 'app-sets-panel',
  templateUrl: './sets-panel.component.html',
  styleUrls: ['./sets-panel.component.scss'],
})
export class SetsPanelComponent implements OnInit {
  selectedSet: Set | null = null;
  sets$ = this.setsService.getSetsListener().pipe(
    map((sets) => {
      return sets.map((item) => {
        const formattedName = item.name[0].toUpperCase() + item.name.slice(1);
        const updatedSet = { ...item, name: formattedName };
        return updatedSet;
      });
    })
  );
  constructor(
    private setsService: SetsService,
    private popupService: PopupService
  ) {}

  onDeleteSet(set: Set) {
    this.popupService
      .getConfirmEventListener()
      .pipe(take(1))
      .subscribe((isConfirm) => {
        if (isConfirm) {
          this.setsService
            .deleteSet(set._id as string)
            .pipe(take(1))
            .subscribe();
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
    console.log(set);
  }

  ngOnInit(): void {
    this.setsService.getSets().subscribe();
  }

  onLoadMore() {}
}
