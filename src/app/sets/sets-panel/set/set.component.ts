import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Set } from 'src/app/shared/models/set/set.model';
@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss'],
})
export class SetComponent {
  @Output() private selectSet = new EventEmitter<Set>();
  @Output() private deleteSet = new EventEmitter<Set>();
  @Input() set!: Set;

  onSelectSet(set: Set) {
    this.selectSet.emit(set);
  }

  onDeleteSet(set: Set) {
    this.deleteSet.emit(set);
  }
}
