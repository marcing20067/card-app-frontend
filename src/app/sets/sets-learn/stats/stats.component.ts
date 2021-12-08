import { Component, Input } from '@angular/core';
import { Set } from 'src/app/shared/models/set.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  @Input() data!: {
    groups: Set['stats'];
    currentGroup: number;
  }
}
