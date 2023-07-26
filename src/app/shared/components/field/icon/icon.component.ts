import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() src = '';
  orangeSrc = '';
  isOrange = false;
  private ICON_EXT = '.svg';

  ngOnInit() {
    const iconName = this.src.split(this.ICON_EXT)[0];
    this.orangeSrc = iconName + '-orange' + this.ICON_EXT;
  }
}
