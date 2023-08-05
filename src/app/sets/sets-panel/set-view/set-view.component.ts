import { Component, Input } from '@angular/core';
import { Set } from '../../shared/models/set.model';
@Component({
  selector: 'app-set-view',
  templateUrl: './set-view.component.html',
  styleUrls: ['./set-view.component.scss'],
})
export class SetViewComponent {
  @Input() set!: Set | null;
}
