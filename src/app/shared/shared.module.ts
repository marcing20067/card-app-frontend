import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './components/field/field.component';
import { InputDirective } from './components/field/input/input.directive';
import { IconComponent } from './components/field/icon/icon.component';
import { RouterModule } from '@angular/router';
import { CirclesComponent } from './components/circles/circles.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [FieldComponent, InputDirective, IconComponent, CirclesComponent, LoaderComponent],
  imports: [CommonModule, RouterModule],
  exports: [FieldComponent, InputDirective, IconComponent, CirclesComponent, LoaderComponent],
})
export class SharedModule {}
