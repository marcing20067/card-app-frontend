import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './components/field/field.component';
import { InputDirective } from './components/field/input/input.directive';
import { IconComponent } from './components/field/icon/icon.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FieldComponent, InputDirective, IconComponent],
  imports: [CommonModule, RouterModule],
  exports: [FieldComponent, InputDirective, IconComponent],
})
export class SharedModule {}
