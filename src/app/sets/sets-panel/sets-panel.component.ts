import { Component, OnInit } from '@angular/core';
import { SetsService } from '../sets.service';
import { Set } from 'src/app/shared/models/set.model';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-sets-panel',
  templateUrl: './sets-panel.component.html',
  styleUrls: ['./sets-panel.component.scss'],
})
export class SetsPanelComponent implements OnInit {
  selectedSet: Set | null = null;
  sets$ = this.setsService.getSetsListener();
  constructor(private setsService: SetsService) {}

  onDeleteSet(id: string | undefined) {
    this.setsService
      .deleteSet(id as string)
      .pipe(take(1))
      .subscribe();
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
