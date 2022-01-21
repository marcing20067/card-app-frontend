import { Component, Input } from '@angular/core';
import { Set } from 'src/app/shared/models/set/set.model';
@Component({
  selector: 'app-set-view',
  templateUrl: './set-view.component.html',
  styleUrls: ['./set-view.component.scss'],
})
export class SetViewComponent {
  @Input() set!: Set | null;
}
