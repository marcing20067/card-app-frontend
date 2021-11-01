import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldService } from '../field.service';
import { FieldState } from '../fieldState.model';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() inputId = '';
  @Input() src = '';
  ICON_EXT = '.svg';
  srcWithoutExt = '';

  inputState$!: Observable<FieldState>;

  constructor(private fieldService: FieldService) {}

  
  ngOnInit(): void {
    const splitedSrc = this.src.split(this.ICON_EXT);
    this.srcWithoutExt = splitedSrc[0];
    this.inputState$ = this.fieldService.getFieldStateListener(this.inputId);
  }
}
