import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Set } from 'src/app/shared/models/set.model';
@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss']
})
export class SetComponent {
  @Input() set!: Set;
  @Output() selectSet = new EventEmitter<Set>();
  @Output() deleteSet = new EventEmitter<string>();

  onSelectSet(set: Set) {
    this.selectSet.emit(set);
  }

  onDeleteSet(setId: string | undefined) {
    this.deleteSet.emit(setId);
  }

}
