import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { FieldComponent } from './field/field.component';
import { InputDirective } from './field/input/input.directive';
import { IconComponent } from './field/icon/icon.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FooterComponent, FieldComponent, InputDirective, IconComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterComponent, FieldComponent, InputDirective, IconComponent],
})
export class SharedModule {}
