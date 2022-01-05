import { Component, Input } from '@angular/core';
import { Stats } from 'src/app/shared/models/set/stats.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  @Input() data!: {
    stats: Stats;
    currentGroup: number;
  }
}
