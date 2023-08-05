import { Component } from '@angular/core';
import { TabulationService } from 'src/app/shared/services/tabulation/tabulation.service';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss'],
})
export class InstructionComponent {
  private instructionEl = document.querySelector('app-instruction') as HTMLElement;
  show = false;

  constructor(private scrollService: ScrollService, private tabulationService: TabulationService) {}

  onShow() {
    this.show = true;
    this.scrollService.blockScroll();
    this.tabulationService.trapTabulation(this.instructionEl);
  }

  onClose() {
    this.show = false;
    this.scrollService.unLockScroll();
    this.tabulationService.releaseTabulation()
  }
}
