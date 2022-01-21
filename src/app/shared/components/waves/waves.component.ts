import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.scss'],
})
export class WavesComponent {
  @Input() rotate!: boolean;
}
