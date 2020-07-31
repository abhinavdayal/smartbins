import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedCounterComponent } from './animated-counter/animated-counter.component';
import { CarouselComponent, CarouselContent } from './carousel/carousel.component'
import { AngularMaterialModule } from '../angular-material.module';


@NgModule({
  declarations: [AnimatedCounterComponent, CarouselComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    AnimatedCounterComponent,
    CarouselComponent
  ]
})
export class SharedModule { }
