import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldService } from '../field.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() inputId = '';
  @Input() src = '';
  ICON_EXT = '.svg';
  src$!: Observable<string>;
  constructor(private fieldService: FieldService) {}

  ngOnInit() {
    const splitedSrc = this.src.split(this.ICON_EXT);
    const srcWithoutExt = splitedSrc[0];
    this.src$ = this.fieldService
      .getFieldStateListener(this.inputId)
      .pipe(
        map((state) =>
          state.isFocus
            ? srcWithoutExt + '-orange' + this.ICON_EXT
            : srcWithoutExt + this.ICON_EXT
        )
      );
  }
}
