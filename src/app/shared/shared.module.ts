import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedCounterComponent } from './animated-counter/animated-counter.component'


@NgModule({
  declarations: [AnimatedCounterComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AnimatedCounterComponent
  ]
})
export class SharedModule { }
