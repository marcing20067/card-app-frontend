import { Component } from '@angular/core';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';

@Component({
  selector: 'app-instrucion',
  templateUrl: './instrucion.component.html',
  styleUrls: ['./instrucion.component.scss'],
})
export class InstrucionComponent {
  show = false;

  constructor(private scrollService: ScrollService) {}

  onShow() {
    this.show = true;
    this.scrollService.blockScroll();
  }

  onClose() {
    this.show = false;
    this.scrollService.unLockScroll();
  }
}
