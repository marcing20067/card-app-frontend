import { Component } from '@angular/core';
import { SetsService } from '../sets.service';
import { Set } from 'src/app/shared/models/set.model';
@Component({
  selector: 'app-sets-panel',
  templateUrl: './sets-panel.component.html',
  styleUrls: ['./sets-panel.component.scss']
})
export class SetsPanelComponent {
  selectedSet: Set | null = null;
  sets$ = this.setsService.getSets();
  constructor(private setsService: SetsService) {
    this.sets$.subscribe(sets => {
      console.log(sets.length);
    })
  }

  onDeleteSet(id: string | undefined) {
    console.log(id);
  }

  onSelectSet(set: Set) {
    this.selectedSet = set;
    console.log(set);
  }

  onLoadMore() {

  }
}
