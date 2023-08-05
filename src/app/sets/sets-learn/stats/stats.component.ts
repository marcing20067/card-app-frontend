import { Component, Input } from '@angular/core';
import { Stats } from '../../shared/models/stats.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  @Input() data!: {
    stats: Stats;
    currentGroup: number;
  };
}
